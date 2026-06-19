"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Save, Trash2, AlertCircle } from "lucide-react";

// ─── Tipos da resposta GET /api/admin/catalog ───
interface ModelRow { slug: string; nome: string; descricao: string; ativo: boolean; sort: number }
interface SizeRow { slug: string; nome: string; dimensoes: string; ativo: boolean; sort: number }
interface BaseRow { slug: string; nome: string; descricao: string; precoAdicionalCentavos: number; ativo: boolean; sort: number }
interface ExtraRow { slug: string; nome: string; precoCentavos: number; ativo: boolean; sort: number }
interface DiscountRow { id: string; minQty: number; percentual: number }
interface ModelSizeRow { modelSlug: string; sizeSlug: string; basePriceCentavos: number; gabaritoUrl: string | null }
interface SkuRow { modelSlug: string; sizeSlug: string; baseSlug: string; tinySku: string | null }
interface SettingRow { key: string; valueInt: number | null; valueText: string | null }

interface CatalogData {
  models: ModelRow[];
  sizes: SizeRow[];
  bases: BaseRow[];
  extras: ExtraRow[];
  discounts: DiscountRow[];
  modelSize: ModelSizeRow[];
  skus: SkuRow[];
  settings: SettingRow[];
}

// ─── Helpers de moeda (centavos <-> reais) ───
const toReais = (c: number) => (c / 100).toFixed(2);
const toCentavos = (reais: string) => Math.round(parseFloat(reais.replace(",", ".")) * 100) || 0;

export default function ProdutosPage() {
  const [data, setData] = useState<CatalogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/catalog");
      if (!res.ok) throw new Error("Falha ao carregar catálogo");
      setData(await res.json());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Envia uma ação e recarrega
  const post = useCallback(
    async (payload: Record<string, unknown>) => {
      setSaving(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/catalog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Falha ao salvar");
        await load();
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro ao salvar");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [load]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 flex items-center justify-center text-text-muted">
        <Loader2 className="animate-spin mr-2" size={20} /> Carregando catálogo...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-price-red">
        {error ?? "Erro ao carregar."}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Produtos & Preços</h1>
        {saving && (
          <span className="flex items-center gap-1.5 text-sm text-text-muted">
            <Loader2 className="animate-spin" size={14} /> Salvando...
          </span>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="p-3 bg-blue/5 border border-blue/20 rounded-lg text-xs text-text flex items-start gap-2">
        <AlertCircle size={14} className="text-blue mt-0.5 flex-shrink-0" />
        As imagens dos produtos continuam definidas no código (por slug). Itens novos
        usam um placeholder até um desenvolvedor mapear a imagem do slug.
      </div>

      <ModelsSection models={data.models} post={post} />
      <SizesSection sizes={data.sizes} post={post} />
      <BasesSection bases={data.bases} post={post} />
      <ExtrasSection extras={data.extras} post={post} />
      <DiscountsSection discounts={data.discounts} post={post} />
      <PricingSection data={data} post={post} />
      <SkusSection data={data} post={post} />
      <SettingsSection settings={data.settings} post={post} />
    </div>
  );
}

type PostFn = (payload: Record<string, unknown>) => Promise<boolean>;

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-border rounded-xl p-5 space-y-4">
      <div>
        <h2 className="font-bold text-text">{title}</h2>
        {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

const input = "border border-border rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";
const btnPrimary = "inline-flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-3 py-1.5 rounded-lg disabled:opacity-50";
const btnGhost = "inline-flex items-center gap-1 text-text-muted hover:text-price-red text-sm px-2 py-1.5";

// ─── Modelos ───
function ModelsSection({ models, post }: { models: ModelRow[]; post: PostFn }) {
  return (
    <Section title="Modelos" subtitle="Formatos de Wind Banner (Pena, Faca, etc.)">
      <div className="space-y-2">
        {models.map((m) => (
          <ModelRowEditor key={m.slug} row={m} post={post} />
        ))}
      </div>
      <ModelRowEditor isNew post={post} />
    </Section>
  );
}

function ModelRowEditor({ row, isNew, post }: { row?: ModelRow; isNew?: boolean; post: PostFn }) {
  const [slug, setSlug] = useState(row?.slug ?? "");
  const [nome, setNome] = useState(row?.nome ?? "");
  const [descricao, setDescricao] = useState(row?.descricao ?? "");
  const [ativo, setAtivo] = useState(row?.ativo ?? true);
  const [sort, setSort] = useState(row?.sort ?? 0);

  const save = async () => {
    const ok = await post({ action: "upsertModel", slug, nome, descricao, ativo, sort });
    if (ok && isNew) { setSlug(""); setNome(""); setDescricao(""); setSort(0); }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input className={`${input} w-28`} placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} disabled={!isNew} />
      <input className={`${input} w-32`} placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
      <input className={`${input} flex-1 min-w-[160px]`} placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
      <input className={`${input} w-14`} type="number" title="Ordem" value={sort} onChange={(e) => setSort(parseInt(e.target.value) || 0)} />
      <label className="flex items-center gap-1 text-xs text-text-muted">
        <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} /> ativo
      </label>
      <button className={btnPrimary} onClick={save} disabled={!slug || !nome}>
        {isNew ? <Plus size={14} /> : <Save size={14} />} {isNew ? "Adicionar" : "Salvar"}
      </button>
      {!isNew && row && (
        <button className={btnGhost} onClick={() => confirm(`Excluir modelo "${row.nome}"?`) && post({ action: "deleteModel", slug: row.slug })}>
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

// ─── Tamanhos ───
function SizesSection({ sizes, post }: { sizes: SizeRow[]; post: PostFn }) {
  return (
    <Section title="Tamanhos" subtitle="Medidas disponíveis">
      <div className="space-y-2">
        {sizes.map((s) => (
          <SizeRowEditor key={s.slug} row={s} post={post} />
        ))}
      </div>
      <SizeRowEditor isNew post={post} />
    </Section>
  );
}

function SizeRowEditor({ row, isNew, post }: { row?: SizeRow; isNew?: boolean; post: PostFn }) {
  const [slug, setSlug] = useState(row?.slug ?? "");
  const [nome, setNome] = useState(row?.nome ?? "");
  const [dimensoes, setDimensoes] = useState(row?.dimensoes ?? "");
  const [ativo, setAtivo] = useState(row?.ativo ?? true);
  const [sort, setSort] = useState(row?.sort ?? 0);

  const save = async () => {
    const ok = await post({ action: "upsertSize", slug, nome, dimensoes, ativo, sort });
    if (ok && isNew) { setSlug(""); setNome(""); setDimensoes(""); setSort(0); }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input className={`${input} w-20`} placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} disabled={!isNew} />
      <input className={`${input} w-32`} placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
      <input className={`${input} flex-1 min-w-[140px]`} placeholder="Dimensões (ex: 0,75m x 2,00m)" value={dimensoes} onChange={(e) => setDimensoes(e.target.value)} />
      <input className={`${input} w-14`} type="number" title="Ordem" value={sort} onChange={(e) => setSort(parseInt(e.target.value) || 0)} />
      <label className="flex items-center gap-1 text-xs text-text-muted">
        <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} /> ativo
      </label>
      <button className={btnPrimary} onClick={save} disabled={!slug || !nome}>
        {isNew ? <Plus size={14} /> : <Save size={14} />} {isNew ? "Adicionar" : "Salvar"}
      </button>
      {!isNew && row && (
        <button className={btnGhost} onClick={() => confirm(`Excluir tamanho "${row.nome}"?`) && post({ action: "deleteSize", slug: row.slug })}>
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

// ─── Bases ───
function BasesSection({ bases, post }: { bases: BaseRow[]; post: PostFn }) {
  return (
    <Section title="Bases e Estrutura" subtitle="Preço adicional somado ao preço base (R$)">
      <div className="space-y-2">
        {bases.map((b) => (
          <BaseRowEditor key={b.slug} row={b} post={post} />
        ))}
      </div>
      <BaseRowEditor isNew post={post} />
    </Section>
  );
}

function BaseRowEditor({ row, isNew, post }: { row?: BaseRow; isNew?: boolean; post: PostFn }) {
  const [slug, setSlug] = useState(row?.slug ?? "");
  const [nome, setNome] = useState(row?.nome ?? "");
  const [descricao, setDescricao] = useState(row?.descricao ?? "");
  const [preco, setPreco] = useState(toReais(row?.precoAdicionalCentavos ?? 0));
  const [ativo, setAtivo] = useState(row?.ativo ?? true);
  const [sort, setSort] = useState(row?.sort ?? 0);

  const save = async () => {
    const ok = await post({ action: "upsertBase", slug, nome, descricao, precoAdicionalCentavos: toCentavos(preco), ativo, sort });
    if (ok && isNew) { setSlug(""); setNome(""); setDescricao(""); setPreco("0.00"); setSort(0); }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input className={`${input} w-32`} placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} disabled={!isNew} />
      <input className={`${input} w-32`} placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
      <input className={`${input} flex-1 min-w-[140px]`} placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
      <div className="flex items-center gap-1">
        <span className="text-xs text-text-muted">R$</span>
        <input className={`${input} w-20`} type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} />
      </div>
      <input className={`${input} w-14`} type="number" title="Ordem" value={sort} onChange={(e) => setSort(parseInt(e.target.value) || 0)} />
      <label className="flex items-center gap-1 text-xs text-text-muted">
        <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} /> ativo
      </label>
      <button className={btnPrimary} onClick={save} disabled={!slug || !nome}>
        {isNew ? <Plus size={14} /> : <Save size={14} />} {isNew ? "Adicionar" : "Salvar"}
      </button>
      {!isNew && row && (
        <button className={btnGhost} onClick={() => confirm(`Excluir base "${row.nome}"?`) && post({ action: "deleteBase", slug: row.slug })}>
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

// ─── Extras ───
function ExtrasSection({ extras, post }: { extras: ExtraRow[]; post: PostFn }) {
  return (
    <Section title="Extras" subtitle="Itens adicionais (R$)">
      <div className="space-y-2">
        {extras.map((e) => (
          <ExtraRowEditor key={e.slug} row={e} post={post} />
        ))}
      </div>
      <ExtraRowEditor isNew post={post} />
    </Section>
  );
}

function ExtraRowEditor({ row, isNew, post }: { row?: ExtraRow; isNew?: boolean; post: PostFn }) {
  const [slug, setSlug] = useState(row?.slug ?? "");
  const [nome, setNome] = useState(row?.nome ?? "");
  const [preco, setPreco] = useState(toReais(row?.precoCentavos ?? 0));
  const [ativo, setAtivo] = useState(row?.ativo ?? true);
  const [sort, setSort] = useState(row?.sort ?? 0);

  const save = async () => {
    const ok = await post({ action: "upsertExtra", slug, nome, precoCentavos: toCentavos(preco), ativo, sort });
    if (ok && isNew) { setSlug(""); setNome(""); setPreco("0.00"); setSort(0); }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input className={`${input} w-36`} placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} disabled={!isNew} />
      <input className={`${input} flex-1 min-w-[140px]`} placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
      <div className="flex items-center gap-1">
        <span className="text-xs text-text-muted">R$</span>
        <input className={`${input} w-20`} type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} />
      </div>
      <input className={`${input} w-14`} type="number" title="Ordem" value={sort} onChange={(e) => setSort(parseInt(e.target.value) || 0)} />
      <label className="flex items-center gap-1 text-xs text-text-muted">
        <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} /> ativo
      </label>
      <button className={btnPrimary} onClick={save} disabled={!slug || !nome}>
        {isNew ? <Plus size={14} /> : <Save size={14} />} {isNew ? "Adicionar" : "Salvar"}
      </button>
      {!isNew && row && (
        <button className={btnGhost} onClick={() => confirm(`Excluir extra "${row.nome}"?`) && post({ action: "deleteExtra", slug: row.slug })}>
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

// ─── Descontos ───
function DiscountsSection({ discounts, post }: { discounts: DiscountRow[]; post: PostFn }) {
  const [rows, setRows] = useState(discounts.map((d) => ({ minQty: d.minQty, percentual: d.percentual })));

  const update = (i: number, field: "minQty" | "percentual", v: number) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [field]: v } : row)));

  return (
    <Section title="Descontos por quantidade" subtitle="A partir de X unidades, Y% de desconto">
      <div className="space-y-2">
        {rows.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-text-muted">a partir de</span>
            <input className={`${input} w-20`} type="number" value={d.minQty} onChange={(e) => update(i, "minQty", parseInt(e.target.value) || 0)} />
            <span className="text-xs text-text-muted">un</span>
            <input className={`${input} w-16`} type="number" value={d.percentual} onChange={(e) => update(i, "percentual", parseInt(e.target.value) || 0)} />
            <span className="text-xs text-text-muted">%</span>
            <button className={btnGhost} onClick={() => setRows((r) => r.filter((_, idx) => idx !== i))}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 pt-1">
        <button className="inline-flex items-center gap-1 text-sm text-primary font-medium" onClick={() => setRows((r) => [...r, { minQty: 0, percentual: 0 }])}>
          <Plus size={14} /> Adicionar faixa
        </button>
        <button className={btnPrimary} onClick={() => post({ action: "setDiscounts", discounts: rows.filter((d) => d.minQty > 0) })}>
          <Save size={14} /> Salvar descontos
        </button>
      </div>
    </Section>
  );
}

// ─── Preços base & gabaritos (matriz modelo × tamanho) ───
function PricingSection({ data, post }: { data: CatalogData; post: PostFn }) {
  return (
    <Section title="Preços base & Gabaritos" subtitle="Preço base (R$) e caminho do gabarito por modelo × tamanho">
      <div className="space-y-2">
        {data.models.map((m) =>
          data.sizes.map((s) => {
            const cell = data.modelSize.find((x) => x.modelSlug === m.slug && x.sizeSlug === s.slug);
            return <PriceCell key={`${m.slug}-${s.slug}`} modelSlug={m.slug} sizeSlug={s.slug} label={`${m.nome} · ${s.nome}`} cell={cell} post={post} />;
          })
        )}
      </div>
    </Section>
  );
}

function PriceCell({ modelSlug, sizeSlug, label, cell, post }: { modelSlug: string; sizeSlug: string; label: string; cell?: ModelSizeRow; post: PostFn }) {
  const [preco, setPreco] = useState(toReais(cell?.basePriceCentavos ?? 0));
  const [gabarito, setGabarito] = useState(cell?.gabaritoUrl ?? "");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-36 text-sm text-text">{label}</span>
      <div className="flex items-center gap-1">
        <span className="text-xs text-text-muted">R$</span>
        <input className={`${input} w-24`} type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} />
      </div>
      <input className={`${input} flex-1 min-w-[200px]`} placeholder="/gabaritos/...pdf" value={gabarito} onChange={(e) => setGabarito(e.target.value)} />
      <button
        className={btnPrimary}
        onClick={() => post({ action: "setModelSize", modelSlug, sizeSlug, basePriceCentavos: toCentavos(preco), gabaritoUrl: gabarito || null })}
      >
        <Save size={14} /> Salvar
      </button>
    </div>
  );
}

// ─── SKUs (matriz modelo × tamanho × base) ───
function SkusSection({ data, post }: { data: CatalogData; post: PostFn }) {
  return (
    <Section title="SKUs do Tiny" subtitle="Código do Tiny por modelo × tamanho × base">
      <div className="space-y-2">
        {data.models.map((m) =>
          data.sizes.map((s) =>
            data.bases.map((b) => {
              const cell = data.skus.find((x) => x.modelSlug === m.slug && x.sizeSlug === s.slug && x.baseSlug === b.slug);
              return (
                <SkuCell
                  key={`${m.slug}-${s.slug}-${b.slug}`}
                  modelSlug={m.slug}
                  sizeSlug={s.slug}
                  baseSlug={b.slug}
                  label={`${m.nome} · ${s.nome} · ${b.nome}`}
                  cell={cell}
                  post={post}
                />
              );
            })
          )
        )}
      </div>
    </Section>
  );
}

function SkuCell({ modelSlug, sizeSlug, baseSlug, label, cell, post }: { modelSlug: string; sizeSlug: string; baseSlug: string; label: string; cell?: SkuRow; post: PostFn }) {
  const [sku, setSku] = useState(cell?.tinySku ?? "");
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex-1 min-w-[220px] text-sm text-text">{label}</span>
      <input className={`${input} w-36`} placeholder="SKU Tiny" value={sku} onChange={(e) => setSku(e.target.value)} />
      <button className={btnPrimary} onClick={() => post({ action: "setSku", modelSlug, sizeSlug, baseSlug, tinySku: sku || null })}>
        <Save size={14} /> Salvar
      </button>
    </div>
  );
}

// ─── Configurações ───
function SettingsSection({ settings, post }: { settings: SettingRow[]; post: PostFn }) {
  const arte = settings.find((s) => s.key === "preco_arte_wear")?.valueInt ?? 0;
  const dias = settings.find((s) => s.key === "dias_adicionais_arte_wear")?.valueInt ?? 0;
  const [precoArte, setPrecoArte] = useState(toReais(arte));
  const [diasArte, setDiasArte] = useState(dias);

  return (
    <Section title="Configurações" subtitle="Preço da arte criada pela Wear e prazo adicional">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-text">Preço por arte</span>
          <span className="text-xs text-text-muted">R$</span>
          <input className={`${input} w-24`} type="number" step="0.01" value={precoArte} onChange={(e) => setPrecoArte(e.target.value)} />
          <button className={btnPrimary} onClick={() => post({ action: "setSetting", key: "preco_arte_wear", valueInt: toCentavos(precoArte) })}>
            <Save size={14} /> Salvar
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text">Dias adicionais (arte)</span>
          <input className={`${input} w-16`} type="number" value={diasArte} onChange={(e) => setDiasArte(parseInt(e.target.value) || 0)} />
          <button className={btnPrimary} onClick={() => post({ action: "setSetting", key: "dias_adicionais_arte_wear", valueInt: diasArte })}>
            <Save size={14} /> Salvar
          </button>
        </div>
      </div>
    </Section>
  );
}
