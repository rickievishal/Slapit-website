import React, { useEffect, useState } from 'react';
import { Check, Printer } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { PrintJob } from '../../types';
import { getImageUrl } from '../../utils/imageUrl';

export const PrintJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<PrintJob[]>([]);
  const [completedInputs, setCompletedInputs] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [savingJob, setSavingJob] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    orderService
      .getPrintJobs()
      .then((result) => {
        if (isMounted) {
          setJobs(result);
          setCompletedInputs(
            Object.fromEntries(
              result.map((job) => [`${job.productId}:${job.size}`, String(job.completedCopies)])
            )
          );
          setError('');
        }
      })
      .catch((err) => {
        console.error('Failed to load print jobs:', err);
        if (isMounted) setError('Could not load print jobs. Please try again.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const retryLoadJobs = () => {
    setIsLoading(true);
    setError('');
    orderService
      .getPrintJobs()
      .then((result) => {
        setJobs(result);
        setCompletedInputs(
          Object.fromEntries(
            result.map((job) => [`${job.productId}:${job.size}`, String(job.completedCopies)])
          )
        );
      })
      .catch((err) => {
        console.error('Failed to load print jobs:', err);
        setError('Could not load print jobs. Please try again.');
      })
      .finally(() => setIsLoading(false));
  };

  const saveProgress = async (job: PrintJob) => {
    const key = `${job.productId}:${job.size}`;
    const completedCopies = Number(completedInputs[key]);
    if (!Number.isInteger(completedCopies) || completedCopies < 0 || completedCopies > job.quantity) {
      setError(`Enter a whole number between 0 and ${job.quantity} for ${job.productName}.`);
      return;
    }

    setSavingJob(key);
    setError('');
    try {
      const updated = await orderService.updatePrintJob(job.productId, {
        size: job.size,
        completedCopies,
      });
      setJobs((current) =>
        current.map((item) =>
          item.productId === job.productId && item.size === job.size
            ? {
                ...item,
                completedCopies: updated.completedCopies,
                remainingCopies: updated.remainingCopies,
              }
            : item
        )
      );
    } catch (err) {
      console.error('Failed to save print progress:', err);
      setError(`Could not save progress for ${job.productName} (${job.size}). Refresh and try again.`);
    } finally {
      setSavingJob(null);
    }
  };

  const totalPrints = jobs.reduce((sum, job) => sum + job.remainingCopies, 0);
  const completedPrints = jobs.reduce((sum, job) => sum + job.completedCopies, 0);
  const pendingJobs = jobs.filter((job) => job.remainingCopies > 0);
  const completedJobs = jobs.filter((job) => job.remainingCopies === 0);

  const renderJobCard = (job: PrintJob, isCompleted: boolean) => {
    const key = `${job.productId}:${job.size}`;
    return (
      <article
        key={key}
        className={`flex flex-col justify-between gap-5 border-2 p-5 sm:flex-row ${
          isCompleted
            ? 'border-neutral-300 bg-neutral-100 opacity-70'
            : 'border-black bg-white shadow-[4px_4px_0px_0px_#000000]'
        }`}
      >
        <div className="flex min-w-0 gap-4">
          <img
            src={getImageUrl(job.image || 'https://placehold.co/112x144/1a1a1a/5CE1E6?text=Poster')}
            alt={job.productName}
            className={`h-28 w-20 shrink-0 border bg-neutral-100 object-cover ${
              isCompleted ? 'border-neutral-300 grayscale' : 'border-black'
            }`}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500">
              <Printer className="h-3.5 w-3.5" />
              {isCompleted ? 'Completed print job' : 'Print batch'}
            </div>
            <h2 className="mt-1 break-words text-lg font-black text-black">{job.productName}</h2>
            <p className="mt-1 text-xs font-bold uppercase text-neutral-600">Size: {job.size}</p>
            <p className="mt-3 text-2xl font-black text-black">
              {isCompleted ? job.quantity : job.remainingCopies}{' '}
              <span className="text-sm uppercase">{isCompleted ? 'copies printed' : 'left to print'}</span>
            </p>
            <p className={`mt-1 text-xs font-bold ${isCompleted ? 'text-neutral-500' : 'text-emerald-700'}`}>
              {job.completedCopies} of {job.quantity} completed
            </p>
            <div className="mt-2 h-2 w-full max-w-48 border border-neutral-300 bg-white">
              <div
                className={`h-full ${isCompleted ? 'bg-neutral-400' : 'bg-[#5CE1E6]'}`}
                style={{
                  width: `${job.quantity > 0 ? (job.completedCopies / job.quantity) * 100 : 0}%`,
                }}
              />
            </div>
            <p className="mt-1 text-[11px] text-neutral-500">
              Across {job.orderCount} order{job.orderCount === 1 ? '' : 's'}
            </p>
            <p className="mt-2 break-words font-mono text-[10px] text-neutral-400">
              {job.orderNumbers.join(', ')}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 self-start sm:self-end">
          <label className={`text-[10px] font-black uppercase ${isCompleted ? 'text-neutral-500' : 'text-neutral-500'}`}>
            Copies completed
            <input
              type="number"
              min={0}
              max={job.quantity}
              step={1}
              value={completedInputs[key] ?? String(job.completedCopies)}
              onChange={(event) =>
                setCompletedInputs((current) => ({ ...current, [key]: event.target.value }))
              }
              className={`mt-1 block w-28 border-2 px-2 py-2 text-sm font-bold text-black ${
                isCompleted
                  ? 'border-neutral-400 bg-neutral-50'
                  : 'border-black bg-white'
              }`}
            />
          </label>
          {isCompleted && (
            <p className="max-w-36 text-[10px] font-medium text-neutral-500">
              Change the count to reopen this job.
            </p>
          )}
          <button
            type="button"
            onClick={() => void saveProgress(job)}
            disabled={savingJob !== null}
            className={`inline-flex items-center justify-center gap-2 border-2 px-4 py-2.5 text-xs font-black uppercase transition-colors disabled:cursor-wait disabled:opacity-60 ${
              isCompleted
                ? 'border-neutral-400 bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                : 'border-black bg-[#5CE1E6] text-black hover:bg-[#3bd2d8]'
            }`}
          >
            <Check className="h-4 w-4" />
            {savingJob === key ? 'Saving...' : isCompleted ? 'Edit history' : 'Save progress'}
          </button>
        </div>
      </article>
    );
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 border-b border-neutral-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-black sm:text-3xl">Print Jobs</h1>
          <p className="mt-1 text-xs font-medium text-neutral-500">
            Grouped poster quantities from active orders. Record partial progress; completed batches stay visible.
          </p>
        </div>
        <div className="flex gap-3 text-xs font-bold">
          <span className="border-2 border-black bg-white px-3 py-2">{jobs.length} BATCHES</span>
          <span className="border-2 border-black bg-[#5CE1E6] px-3 py-2">{totalPrints} LEFT TO PRINT</span>
          <span className="border-2 border-black bg-emerald-100 px-3 py-2">{completedPrints} DONE</span>
        </div>
      </header>

      {error && (
        <div role="alert" className="flex items-center justify-between gap-4 border-2 border-red-500 bg-red-50 px-4 py-3 text-sm font-bold text-red-800">
          <span>{error}</span>
          <button onClick={retryLoadJobs} className="shrink-0 underline">
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="border-2 border-black bg-white py-12 text-center text-sm font-bold text-neutral-500">
          Loading print jobs...
        </div>
      ) : jobs.length === 0 ? (
        <div className="border-2 border-black bg-white px-6 py-14 text-center shadow-[4px_4px_0px_0px_#000000]">
          <Check className="mx-auto h-8 w-8 text-emerald-600" />
          <h2 className="mt-3 font-black text-black">All caught up</h2>
          <p className="mt-1 text-sm text-neutral-500">There are no pending print jobs.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-300 pb-2">
              <h2 className="text-sm font-black uppercase tracking-wide text-black">Pending jobs</h2>
              <span className="font-mono text-xs font-bold text-neutral-500">
                {pendingJobs.length} batches
              </span>
            </div>
            {pendingJobs.length === 0 ? (
              <p className="border border-neutral-200 bg-white px-4 py-5 text-sm text-neutral-500">
                No jobs left to print.
              </p>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {pendingJobs.map((job) => renderJobCard(job, false))}
              </div>
            )}
          </section>

          {completedJobs.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-300 pb-2">
                <h2 className="text-sm font-black uppercase tracking-wide text-neutral-500">
                  Print history
                </h2>
                <span className="font-mono text-xs font-bold text-neutral-400">
                  {completedJobs.length} completed
                </span>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {completedJobs.map((job) => renderJobCard(job, true))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
