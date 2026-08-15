/**
 * Design reminder — Midnight Decision Terminal:
 * Carbon Ink decision stages, Bone research surfaces, Lime Signal only at selection points,
 * and hard-edged editorial controls that turn 100 options into a defensible shortlist.
 */
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  CirclePlus,
  CircleX,
  Filter,
  ListFilter,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { categoryMeta, ideas, initialShortlist, type Difficulty, type Idea, type IdeaCategory } from "@/data/ideas";

const logoImage = "/manus-storage/ai-commerce-logo_6a75ea5d.png";
const allCategories = Object.keys(categoryMeta) as IdeaCategory[];
const difficultyOrder: Difficulty[] = ["低", "中", "高"];

function scoreLabel(score: number) {
  if (score >= 21) return "先行検証";
  if (score >= 19) return "検討候補";
  return "探索候補";
}

function difficultyClass(value: Difficulty) {
  return value === "低" ? "easy" : value === "中" ? "medium" : "hard";
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<IdeaCategory | "すべて">("すべて");
  const [minPriority, setMinPriority] = useState("すべて");
  const [difficulty, setDifficulty] = useState<Difficulty | "すべて">("すべて");
  const [onlyFast, setOnlyFast] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>(initialShortlist.slice(0, 3));
  const [activeIdea, setActiveIdea] = useState<Idea | null>(null);

  const filteredIdeas = useMemo(() => {
    const lower = query.trim().toLowerCase();
    return ideas.filter((idea) => {
      const matchingText = !lower || [idea.title, idea.summary, idea.customer, idea.revenue, idea.kpi, idea.category]
        .join(" ").toLowerCase().includes(lower);
      const matchingCategory = category === "すべて" || idea.category === category;
      const matchingPriority = minPriority === "すべて" || idea.priority >= Number(minPriority);
      const matchingDifficulty = difficulty === "すべて" || idea.difficulty === difficulty;
      const matchingFast = !onlyFast || (idea.priority >= 21 && idea.difficulty !== "高");
      return matchingText && matchingCategory && matchingPriority && matchingDifficulty && matchingFast;
    });
  }, [query, category, minPriority, difficulty, onlyFast]);

  const selectedIdeas = ideas.filter((idea) => selectedIds.includes(idea.id));
  const priorityIdeas = ideas.filter((idea) => initialShortlist.includes(idea.id));
  const categoryCounts = allCategories.map((item) => ({ category: item, count: ideas.filter((idea) => idea.category === item).length }));

  const resetFilters = () => {
    setQuery(""); setCategory("すべて"); setMinPriority("すべて"); setDifficulty("すべて"); setOnlyFast(false);
  };

  const toggleSelected = (id: number) => {
    setSelectedIds((current) => current.includes(id)
      ? current.filter((value) => value !== id)
      : current.length < 4 ? [...current, id] : current);
  };

  return (
    <div className="atlas-shell">
      <header className="atlas-header">
        <a href="#top" className="atlas-brand" aria-label="AI Business Atlas トップへ">
          <img src={logoImage} alt="AI Business Atlas ロゴ" />
          <span className="brand-signal" aria-hidden="true"><i /><i /><i /><b /></span>
          <span><strong>AI BUSINESS</strong><small>IDEA ATLAS / 100</small></span>
        </a>
        <nav aria-label="ページ内ナビゲーション">
          <a href="#shortlist">先行候補</a>
          <a href="#explore">100案を探す</a>
          <a href="#method">評価の見方</a>
        </nav>
        <a href="#compare" className="compare-link"><SlidersHorizontal size={15} /> 比較リスト <b>{selectedIds.length}</b></a>
      </header>

      <main id="top">
        <section className="atlas-hero">
          <div className="hero-index"><span>RESEARCH WORKSPACE</span><span>UPDATED / 2026.08</span></div>
          <div className="hero-grid">
            <div className="hero-title">
              <p className="eyebrow"><span className="signal-dot" /> 100 AI BUSINESS IDEAS</p>
              <h1>100案を、<br /><em>始める順番</em>に変える。</h1>
              <p>HP／LP、SEO・GEO、SNS、AI導入支援、EC。広げるための100案ではなく、<strong>自社が勝てる一案まで絞り込む</strong>ための検討HPです。</p>
              <div className="hero-actions"><a href="#explore" className="green-cta">100案を検討する <ArrowRight size={16} /></a><a href="#method" className="quiet-cta">評価の前提 <CircleHelp size={15} /></a></div>
            </div>
            <div className="hero-atlas" aria-label="100案のカテゴリ構成">
              <div className="hero-brand-stamp" aria-label="AI Business Idea Atlas Signal Mark"><span>AI BUSINESS<br />IDEA ATLAS</span><div className="stamp-signal" aria-hidden="true"><i /><i /><i /><b /></div></div>
              <div className="atlas-number"><span>IDEAS</span><strong>100</strong><span>OPTIONS TO TEST</span></div>
              <div className="category-orbit">
                {categoryCounts.map(({ category: item, count }) => <button key={item} onClick={() => { setCategory(item); document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" }); }}><span>{categoryMeta[item].code}</span><strong>{count}</strong><small>{item}</small></button>)}
              </div>
              <div className="atlas-signal" aria-hidden="true"><i /><i /><i /><b /></div>
            </div>
          </div>
          <div className="hero-foot"><div className="journey-lane"><span><b>100</b> SOURCE POOL</span><i /><span><b>10</b> FIRST SHORTLIST</span><i /><span><b>04</b> SIDE BY SIDE</span><i /><span><b>01</b> VERIFY</span></div><span>FILTER + COMPARE + TEST</span></div>
        </section>

        <section id="shortlist" className="shortlist-section">
          <div className="section-label"><span>01</span> FIRST SHORTLIST <SignalMini /></div>
          <div className="shortlist-heading"><div><h2>最初の10案まで、<br /><em>候補を削る。</em></h2><p>既存のHP制作・広告運用・SEO・EC支援の基盤を活かしやすく、少人数でも仮説検証を始めやすい案を優先しています。</p></div><span className="method-note">基準：顧客課題 / 継続性 / 差別化 / 小さく始めやすさ / 拡張性</span></div>
          <div className="shortlist-table">
            {priorityIdeas.map((idea, index) => <button className="short-row" key={idea.id} onClick={() => setActiveIdea(idea)}><span className="rank">{String(index + 1).padStart(2, "0")}</span><span className="idea-number">#{String(idea.id).padStart(3, "0")}</span><strong>{idea.title}</strong><span className="row-category">{idea.category}</span><span className="row-kpi">{idea.kpi}</span><span className={`priority-pill p${idea.priority}`}>{idea.priority}</span><ArrowRight size={16} /></button>)}
          </div>
        </section>

        <section id="explore" className="explore-section">
          <div className="section-label"><span>02</span> DISCARD CRITERIA <SignalMini /></div>
          <div className="explore-heading"><div><h2>基準を決めて、<em>捨てる。</em></h2><p>カテゴリ、初期難易度、優先度、キーワードで対象を絞り、候補を比較リストへ移してください。評価スコアは市場規模の確定値ではなく、初期検証の順番を付けるための仮説です。</p></div><span className="result-count"><strong>{filteredIdeas.length}</strong> / 100 ideas</span></div>
          <div className="filter-panel">
            <div className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例：EC、BtoB、予約、SEO、CS、在庫" aria-label="事業案を検索" /></div>
            <div className="filter-controls">
              <label><span><Filter size={14} /> 優先度</span><select value={minPriority} onChange={(event) => setMinPriority(event.target.value)}><option>すべて</option><option value="21">21点以上</option><option value="20">20点以上</option><option value="18">18点以上</option></select><ChevronDown size={14} /></label>
              <label><span><ListFilter size={14} /> 初期難易度</span><select value={difficulty} onChange={(event) => setDifficulty(event.target.value as Difficulty | "すべて")}><option>すべて</option>{difficultyOrder.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></label>
              <button className={`fast-filter ${onlyFast ? "on" : ""}`} onClick={() => setOnlyFast(!onlyFast)}><Sparkles size={14} /> すぐ検証できる案</button>
              <button className="reset-filter" onClick={resetFilters}>リセット</button>
            </div>
            <div className="category-filters"><button className={category === "すべて" ? "active" : ""} onClick={() => setCategory("すべて")}>すべて <small>100</small></button>{categoryCounts.map(({ category: item, count }) => <button className={category === item ? "active" : ""} key={item} onClick={() => setCategory(item)}><span>{categoryMeta[item].code}</span>{item} <small>{count}</small></button>)}</div>
          </div>
          <div className="idea-grid">
            {filteredIdeas.map((idea) => <IdeaCard idea={idea} key={idea.id} isSelected={selectedIds.includes(idea.id)} isFull={selectedIds.length >= 4} onDetail={() => setActiveIdea(idea)} onToggle={() => toggleSelected(idea.id)} />)}
          </div>
          {filteredIdeas.length === 0 && <div className="empty-state"><CircleX size={25} /><p>条件に合う案がありません。フィルタを少し緩めてください。</p><button onClick={resetFilters}>すべての案を見る</button></div>}
        </section>

        <section id="compare" className="compare-section">
          <div className="section-label"><span>03</span> SIDE BY SIDE <SignalMini /></div>
          <div className="compare-heading"><div><h2>並べて、<em>決める。</em></h2><p>最大4案まで保存できます。顧客、収益の取り方、初期難易度、追うKPIを横並びにして、次のヒアリングへ持ち込む案を決めます。</p></div><span className="compare-limit">{selectedIdeas.length} / 4 selected</span></div>
          {selectedIdeas.length ? <div className="compare-board">
            <div className="compare-labels"><span>事業案</span><span>主な顧客・課題</span><span>収益モデル</span><span>初期難易度</span><span>追うKPI</span></div>
            {selectedIdeas.map((idea) => <article className="compare-card" key={idea.id}><button className="remove-button" onClick={() => toggleSelected(idea.id)} aria-label={`${idea.title}を比較から外す`}><X size={15} /></button><span className="idea-number">#{String(idea.id).padStart(3, "0")} / {categoryMeta[idea.category].code}</span><h3>{idea.title}</h3><div><small>主な顧客・課題</small><p>{idea.customer}</p></div><div><small>収益モデル</small><p>{idea.revenue}</p></div><div><small>初期難易度</small><p><span className={`difficulty ${difficultyClass(idea.difficulty)}`}>{idea.difficulty}</span> <span className="recurring">継続性 {idea.recurring}</span></p></div><div><small>主KPI</small><p>{idea.kpi}</p></div></article>)}
            {Array.from({ length: Math.max(0, 4 - selectedIdeas.length) }).map((_, index) => <div className="compare-empty" key={index}><CirclePlus size={19} /><span>候補を追加</span></div>)}
          </div> : <div className="empty-state compare-empty-state"><CirclePlus size={25} /><p>気になる案を選び、「比較へ追加」を押してください。</p></div>}
        </section>

        <section id="method" className="method-section">
          <div className="method-copy"><div className="section-label"><span>04</span> FINAL VERIFICATION <SignalMini /></div><h2>最後の1案を、<br /><em>小さく確かめる。</em></h2><p>100案のスコアは、顧客課題の強さ、継続課金性、差別化余地、小さく始めやすさ、拡張性を各5点で机上評価したものです。まずは一案を選び、対象顧客へのヒアリングと限定的なPoCで、継続して買われるかを確かめます。</p></div>
          <div className="method-steps"><article><span>01</span><strong>比較する</strong><p>顧客・KPI・収益モデルが自社の強みとつながるかを見る。</p></article><article><span>02</span><strong>捨てる</strong><p>データ、統合、規制が重い案は、初期候補から外す。</p></article><article><span>03</span><strong>試す</strong><p>30日で価値が見える範囲まで、検証単位を小さくする。</p></article></div>
        </section>
      </main>

      {activeIdea && <div className="detail-backdrop" role="presentation" onMouseDown={() => setActiveIdea(null)}><aside className="detail-drawer" role="dialog" aria-modal="true" aria-label={`${activeIdea.title}の詳細`} onMouseDown={(event) => event.stopPropagation()}><button className="drawer-close" onClick={() => setActiveIdea(null)}><X size={19} /></button><span className="idea-number">#{String(activeIdea.id).padStart(3, "0")} / {categoryMeta[activeIdea.category].code}</span><h2>{activeIdea.title}</h2><p className="drawer-summary">{activeIdea.summary}</p><div className="drawer-score"><span>優先度</span><strong>{activeIdea.priority}<small>/ 25</small></strong><em>{scoreLabel(activeIdea.priority)}</em></div><dl><div><dt>主な顧客・課題</dt><dd>{activeIdea.customer}</dd></div><div><dt>収益モデル</dt><dd>{activeIdea.revenue}</dd></div><div><dt>主KPI</dt><dd>{activeIdea.kpi}</dd></div><div><dt>初期難易度</dt><dd><span className={`difficulty ${difficultyClass(activeIdea.difficulty)}`}>{activeIdea.difficulty}</span> <span className="recurring">継続性 {activeIdea.recurring}</span></dd></div></dl><Button className="drawer-cta" onClick={() => toggleSelected(activeIdea.id)}>{selectedIds.includes(activeIdea.id) ? <><Check size={16} /> 比較リストから外す</> : <><CirclePlus size={16} /> 比較リストに追加</>}</Button></aside></div>}

      <footer className="atlas-footer"><div><img src={logoImage} alt="" /><span>AI BUSINESS IDEA ATLAS</span></div><p>100案は公開情報に基づく事業仮説です。実行前に対象顧客へのヒアリング、競合調査、規制確認、限定的なPoCを行ってください。</p><span>MANUS RESEARCH / 2026</span></footer>
    </div>
  );
}

function IdeaCard({ idea, isSelected, isFull, onDetail, onToggle }: { idea: Idea; isSelected: boolean; isFull: boolean; onDetail: () => void; onToggle: () => void }) {
  const isStarter = initialShortlist.includes(idea.id);
  return <article className={`idea-card ${isSelected ? "selected" : ""}`}>
    <div className="idea-card-top"><span className="idea-number">#{String(idea.id).padStart(3, "0")}</span><span className={`priority-pill p${idea.priority}`}>{idea.priority}</span></div>
    {isStarter && <span className="starter-flag">FIRST SHORTLIST</span>}
    <span className="category-code">{categoryMeta[idea.category].code} / {idea.category}</span>
    <h3>{idea.title}</h3><p>{idea.summary}</p>
    <div className="idea-card-meta"><span className={`difficulty ${difficultyClass(idea.difficulty)}`}>初期難易度 {idea.difficulty}</span><span>継続性 {idea.recurring}</span></div>
    <div className="idea-card-actions"><button onClick={onDetail}>詳細を見る <ArrowRight size={14} /></button><button className={`select-idea ${isSelected ? "selected" : ""}`} disabled={!isSelected && isFull} onClick={onToggle}>{isSelected ? <><Check size={14} /> 追加済</> : <><CirclePlus size={14} /> 比較へ</>}</button></div>
  </article>;
}

function SignalMini() {
  return <span className="signal-mini" aria-hidden="true"><i /><i /><i /><b /></span>;
}
