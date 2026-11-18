import React, { useEffect, useMemo, useState } from 'react';
import { Boxes, PackageCheck, Printer, Save } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { InventoryDemand, InventoryItem } from '../../types';
import { getImageUrl } from '../../utils/imageUrl';

const LOW_STOCK_THRESHOLD = 5;

const inventoryKey = (productId: string, size: string) => `${productId}:${size}`;

export const InventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [demand, setDemand] = useState<InventoryDemand[]>([]);
  const [quantityInputs, setQuantityInputs] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let isMounted = true;
    Promise.all([productService.getInventory(), orderService.getInventoryDemand()])
      .then(([inventoryItems, inventoryDemand]) => {
        if (!isMounted) return;
        setInventory(inventoryItems);
        setDemand(inventoryDemand);
        setQuantityInputs(
          Object.fromEntries(
            inventoryItems.map((item) => [
              inventoryKey(item.productId, item.size),
              String(item.quantity),
            ])
          )
        );
      })
      .catch((err) => {
        console.error('Failed to load inventory:', err);
        if (isMounted) setError('Could not load inventory and order demand. Please retry.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const demandByVariant = useMemo(
    () => new Map(demand.map((item) => [inventoryKey(item.productId, item.size), item])),
    [demand]
  );

  const filteredInventory = inventory.filter((item) =>
    `${item.productName} ${item.category?.name || ''} ${item.size}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalStock = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockVariants = inventory.filter(
    (item) => item.quantity <= LOW_STOCK_THRESHOLD
  ).length;
  const activeDemand = inventory.reduce(
    (sum, item) =>
      sum + (demandByVariant.get(inventoryKey(item.productId, item.size))?.orderedCopies || 0),
    0
  );
  const additionalPrintsNeeded = inventory.reduce((sum, item) => {
    const remainingDemand =
      demandByVariant.get(inventoryKey(item.productId, item.size))?.copiesToPrint || 0;
    return sum + Math.max(remainingDemand - item.quantity, 0);
  }, 0
  );

  const saveQuantity = async (item: InventoryItem) => {
    const key = inventoryKey(item.productId, item.size);
    const quantity = Number(quantityInputs[key]);
    if (!Number.isSafeInteger(quantity) || quantity < 0) {
      setNotice('');
      setError('Stock quantities must be whole numbers greater than or equal to zero.');
      return;
    }

    setSavingKey(key);
    setError('');
    setNotice('');
    try {
      const updated = await productService.updateInventory(item.productId, {
        size: item.size,
        quantity,
      });
      setInventory((current) =>
        current.map((row) =>
          inventoryKey(row.productId, row.size) === key
            ? { ...row, quantity: updated.quantity }
            : row
        )
      );
      setQuantityInputs((current) => ({ ...current, [key]: String(updated.quantity) }));
      setNotice(`${item.productName} (${item.size}) stock updated.`);
    } catch (err) {
      console.error('Failed to update inventory:', err);
      setError(`Could not update stock for ${item.productName} (${item.size}).`);
    } finally {
      setSavingKey(null);
    }
  };

  const retryLoad = () => {
    setIsLoading(true);
    setError('');
    Promise.all([productService.getInventory(), orderService.getInventoryDemand()])
      .then(([inventoryItems, inventoryDemand]) => {
        setInventory(inventoryItems);
        setDemand(inventoryDemand);
        setQuantityInputs(
          Object.fromEntries(
            inventoryItems.map((item) => [
              inventoryKey(item.productId, item.size),
              String(item.quantity),
            ])
          )
        );
      })
      .catch((err) => {
        console.error('Failed to load inventory:', err);
        setError('Could not load inventory and order demand. Please retry.');
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-neutral-200 pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-black sm:text-3xl">Inventory</h1>
          <p className="mt-1 max-w-2xl text-xs font-medium text-neutral-500">
            On-hand stock covers active orders first. This shows only the additional copies to
            print; stock counts remain independently managed.
          </p>
        </div>
        <label className="w-full text-[10px] font-black uppercase tracking-wide text-neutral-500 sm:w-72">
          Search inventory
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Product, category, or size"
            className="mt-1 block w-full border-2 border-black bg-white px-3 py-2.5 text-sm font-medium normal-case text-black outline-none focus:ring-2 focus:ring-[#5CE1E6]"
          />
        </label>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Inventory summary">
        <SummaryCard icon={Boxes} label="Variants tracked" value={inventory.length} />
        <SummaryCard icon={PackageCheck} label="Units on hand" value={totalStock} />
        <SummaryCard icon={Printer} label="Active order demand" value={activeDemand} />
        <SummaryCard
          icon={Printer}
          label="Extra copies to print"
          value={additionalPrintsNeeded}
          tone="cyan"
        />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <p className="font-medium text-neutral-500">
          Low stock: {LOW_STOCK_THRESHOLD} or fewer on-hand copies. Counts start at zero.
        </p>
        <p className="font-bold text-amber-700">{lowStockVariants} low-stock variants</p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center justify-between gap-4 border-2 border-red-500 bg-red-50 px-4 py-3 text-sm font-bold text-red-800"
        >
          <span>{error}</span>
          <button type="button" onClick={retryLoad} className="shrink-0 underline">
            Retry
          </button>
        </div>
      )}
      {notice && (
        <p role="status" className="border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
          {notice}
        </p>
      )}

      <div className="overflow-hidden border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000000]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-xs">
            <thead className="border-b-2 border-black bg-[#FAFAFA] font-mono uppercase text-neutral-500">
              <tr>
                <th className="px-3 py-2.5">Product</th>
                <th className="px-3 py-2.5">Size</th>
                <th className="px-3 py-2.5">On hand</th>
                <th className="px-3 py-2.5">Ordered</th>
                <th className="px-3 py-2.5">Printed</th>
                <th className="px-3 py-2.5">Extra to print</th>
                <th className="px-3 py-2.5">Stock state</th>
                <th className="px-3 py-2.5 text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center font-bold text-neutral-400">
                    Loading inventory...
                  </td>
                </tr>
              ) : filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center font-bold text-neutral-400">
                    {inventory.length === 0
                      ? 'No product sizes to track yet.'
                      : 'No inventory matches your search.'}
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const key = inventoryKey(item.productId, item.size);
                  const orderDemand = demandByVariant.get(key);
                  const isLowStock = item.quantity <= LOW_STOCK_THRESHOLD;
                  const extraToPrint = Math.max(
                    (orderDemand?.copiesToPrint ?? 0) - item.quantity,
                    0
                  );
                  return (
                    <tr key={key} className="h-[60px] align-middle hover:bg-neutral-50">
                      <td className="px-3 py-1.5">
                        <div className="flex items-center gap-2">
                          <img
                            src={getImageUrl(item.image || 'https://placehold.co/80x112/1a1a1a/5CE1E6?text=Poster')}
                            alt=""
                            width={32}
                            height={44}
                            style={{ width: 32, height: 44 }}
                            className="block shrink-0 border border-neutral-300 bg-neutral-100 object-cover"
                          />
                          <div>
                            <p className="text-xs font-bold text-black">{item.productName}</p>
                            <p className="text-[10px] text-neutral-500">
                              {item.category?.name || 'Unassigned'}
                              {item.productStatus === 'draft' ? ' · DRAFT' : ''}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-1.5 font-mono font-bold text-neutral-700">{item.size}</td>
                      <td className="px-3 py-1.5">
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={quantityInputs[key] ?? String(item.quantity)}
                          onChange={(event) =>
                            setQuantityInputs((current) => ({
                              ...current,
                              [key]: event.target.value,
                            }))
                          }
                          aria-label={`${item.productName} ${item.size} stock count`}
                          className="w-16 border-2 border-black bg-white px-1.5 py-1.5 text-xs font-bold text-black"
                        />
                      </td>
                      <td className="px-3 py-1.5 font-mono font-bold">
                        {orderDemand?.orderedCopies ?? 0}
                      </td>
                      <td className="px-3 py-1.5 font-mono text-emerald-700">
                        {orderDemand?.completedCopies ?? 0}
                      </td>
                      <td className="px-3 py-1.5 font-mono font-black text-black">
                        {extraToPrint}
                      </td>
                      <td className="px-3 py-1.5">
                        <span
                          className={`inline-block border px-2 py-1 text-[10px] font-black uppercase ${
                            item.quantity === 0
                              ? 'border-red-300 bg-red-50 text-red-700'
                              : isLowStock
                                ? 'border-amber-300 bg-amber-50 text-amber-800'
                                : 'border-emerald-300 bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          {item.quantity === 0 ? 'Out' : isLowStock ? 'Low' : 'In stock'}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 text-right">
                        <button
                          type="button"
                          onClick={() => void saveQuantity(item)}
                          disabled={savingKey !== null}
                          className="inline-flex items-center gap-1 border-2 border-black bg-[#5CE1E6] px-2 py-1.5 text-[10px] font-black uppercase text-black hover:bg-[#3bd2d8] disabled:cursor-wait disabled:opacity-60"
                        >
                          <Save className="h-3.5 w-3.5" />
                          {savingKey === key ? 'Saving' : 'Save'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface SummaryCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone?: 'default' | 'cyan';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ icon: Icon, label, value, tone = 'default' }) => (
  <div
    className={`flex items-center gap-3 border-2 border-black p-4 shadow-[3px_3px_0px_0px_#000000] ${
      tone === 'cyan' ? 'bg-[#5CE1E6]' : 'bg-white'
    }`}
  >
    <Icon className="h-5 w-5 shrink-0 text-black" />
    <div>
      <p className="text-[10px] font-black uppercase tracking-wide text-neutral-600">{label}</p>
      <p className="text-2xl font-black leading-tight text-black">{value}</p>
    </div>
  </div>
);
