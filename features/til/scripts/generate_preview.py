"""
Generates a checkbox review artifact from a candidates JSON file.

Usage: python3 generate_preview.py <candidates.json> <output.html>

Each entry gets a checkbox. Checking/unchecking updates a JSON array of
kept ids in a read-only textarea at the bottom of the page — copy that
block and paste it back into the chat to have the keepers merged into
keep.json.
"""
import json
import sys
import html
from datetime import datetime

def main():
    candidates_path = sys.argv[1] if len(sys.argv) > 1 else "content/candidates.json"
    output_path = sys.argv[2] if len(sys.argv) > 2 else "content/preview.html"

    with open(candidates_path) as f:
        data = json.load(f)

    def month_key(d):
        return datetime.strptime(d["date"], "%Y-%m-%d").strftime("%B %Y")

    groups = {}
    for entry in data:
        groups.setdefault(month_key(entry), []).append(entry)

    rows = []
    for month, entries in groups.items():
        rows.append(f'<h2 class="month">{html.escape(month)}</h2>')
        for e in entries:
            dt = datetime.strptime(e["date"], "%Y-%m-%d")
            day = dt.strftime("%-d")
            conf_badge = (
                f'<span class="conf conf-{e["confidence"]}">{e["confidence"]}</span>'
                if e["confidence"] == "medium" else ""
            )
            eid = html.escape(e["id"])
            rows.append(f'''
        <article class="entry" data-type="{html.escape(e['type'])}" data-id="{eid}">
          <label class="checkbox-wrap">
            <input type="checkbox" class="keep-box" data-id="{eid}">
          </label>
          <div class="entry-body">
            <div class="meta">
              <span class="date">{day}</span>
              <span class="tag tag-{html.escape(e['type'])}">{html.escape(e['type'])}</span>
              <span class="category">{html.escape(e['category'])}</span>
              {conf_badge}
            </div>
            <h3 class="title">{html.escape(e['title'])}</h3>
            <p class="body">{html.escape(e['body'])}</p>
            <a class="source" href="{html.escape(e['source'])}" target="_blank" rel="noopener">source &#8599;</a>
          </div>
        </article>''')

    body_html = "\n".join(rows)
    count = len(data)
    webdev = sum(1 for e in data if e["type"] == "web-dev")

    html_out = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>TIL - content review ({count} candidates)</title>
<style>
  :root {{
    --ink: #1a1a1a; --paper: #faf8f4; --line: #ddd6c8; --accent: #a8551f;
    --web-dev: #2a5c8a; --general: #5c7a4a; --muted: #8a8272; --keep: #2f7a3d;
  }}
  * {{ box-sizing: border-box; }}
  body {{
    background: var(--paper); color: var(--ink);
    font-family: -apple-system, 'Iowan Old Style', Georgia, serif;
    max-width: 760px; margin: 0 auto; padding: 3rem 1.5rem 8rem; line-height: 1.5;
  }}
  header {{ margin-bottom: 2rem; border-bottom: 3px solid var(--ink); padding-bottom: 1rem; }}
  header h1 {{ font-size: 2rem; margin: 0 0 0.25rem; }}
  header p {{ margin: 0; color: var(--muted); font-family: -apple-system, sans-serif; font-size: 0.9rem; }}
  .filters {{ margin-top: 1rem; font-family: -apple-system, sans-serif; font-size: 0.85rem; }}
  .filters button {{
    background: none; border: 1px solid var(--line); border-radius: 20px;
    padding: 0.3rem 0.9rem; margin-right: 0.5rem; cursor: pointer; color: var(--ink);
  }}
  .filters button.active {{ background: var(--ink); color: var(--paper); border-color: var(--ink); }}
  h2.month {{
    font-family: -apple-system, sans-serif; font-size: 0.75rem; text-transform: uppercase;
    letter-spacing: 0.1em; color: var(--accent); margin: 2.5rem 0 0.75rem;
    border-top: 1px solid var(--line); padding-top: 1.5rem;
  }}
  h2.month:first-of-type {{ border-top: none; padding-top: 0; margin-top: 0; }}
  .entry {{
    display: flex; gap: 0.75rem; margin-bottom: 1.75rem; padding-bottom: 0.25rem;
  }}
  .entry.checked .entry-body {{ opacity: 0.55; }}
  .checkbox-wrap {{ padding-top: 0.2rem; }}
  .keep-box {{ width: 18px; height: 18px; cursor: pointer; }}
  .meta {{
    font-family: -apple-system, sans-serif; font-size: 0.75rem;
    display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem; color: var(--muted);
  }}
  .date {{ font-weight: 600; color: var(--ink); }}
  .tag {{ padding: 0.1rem 0.5rem; border-radius: 3px; font-weight: 600; color: white; font-size: 0.7rem; }}
  .tag-web-dev {{ background: var(--web-dev); }}
  .tag-general {{ background: var(--general); }}
  .category {{ font-style: italic; }}
  .conf {{ padding: 0.1rem 0.4rem; border-radius: 3px; font-size: 0.68rem; border: 1px solid #c9a227; color: #8a6d00; }}
  .title {{ font-size: 1.15rem; margin: 0 0 0.3rem; }}
  .body {{ margin: 0 0 0.35rem; color: #333; }}
  .source {{ font-family: -apple-system, sans-serif; font-size: 0.75rem; color: var(--accent); text-decoration: none; }}
  .source:hover {{ text-decoration: underline; }}
  .entry.hidden {{ display: none; }}
  .review-panel {{
    position: fixed; bottom: 0; left: 0; right: 0; background: var(--ink); color: var(--paper);
    padding: 1rem 1.5rem; font-family: -apple-system, sans-serif;
    box-shadow: 0 -4px 12px rgba(0,0,0,0.2);
  }}
  .review-panel h2 {{ font-size: 0.85rem; margin: 0 0 0.4rem; text-transform: uppercase; letter-spacing: 0.05em; }}
  .review-panel textarea {{
    width: 100%; height: 70px; background: #2a2a2a; color: var(--keep); border: none;
    border-radius: 4px; padding: 0.5rem; font-family: monospace; font-size: 0.8rem; resize: vertical;
  }}
  .review-panel button {{
    margin-top: 0.5rem; background: var(--keep); color: white; border: none;
    border-radius: 4px; padding: 0.4rem 1rem; cursor: pointer; font-size: 0.8rem;
  }}
</style>
</head>
<body>
<header>
  <h1>Today I Learned - content review</h1>
  <p>{count} candidates - {webdev} web-dev - {count - webdev} general</p>
  <div class="filters">
    <button data-filter="all" class="active">All</button>
    <button data-filter="general">General</button>
    <button data-filter="web-dev">Web-dev</button>
  </div>
</header>
{body_html}
<div class="review-panel">
  <h2>Kept selection (<span id="keep-count">0</span>) - copy this and paste it back into the chat</h2>
  <textarea id="keep-output" readonly>[]</textarea>
  <button id="copy-btn">Copy to clipboard</button>
</div>
<script>
  const buttons = document.querySelectorAll('.filters button');
  const entries = document.querySelectorAll('.entry');
  buttons.forEach(btn => btn.addEventListener('click', () => {{
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    entries.forEach(e => {{
      e.classList.toggle('hidden', f !== 'all' && e.dataset.type !== f);
    }});
  }}));

  const boxes = document.querySelectorAll('.keep-box');
  const output = document.getElementById('keep-output');
  const countEl = document.getElementById('keep-count');
  function updateOutput() {{
    const kept = Array.from(boxes).filter(b => b.checked).map(b => b.dataset.id);
    output.value = JSON.stringify(kept, null, 2);
    countEl.textContent = kept.length;
    boxes.forEach(b => b.closest('.entry').classList.toggle('checked', b.checked));
  }}
  boxes.forEach(b => b.addEventListener('change', updateOutput));

  document.getElementById('copy-btn').addEventListener('click', () => {{
    output.select();
    navigator.clipboard.writeText(output.value);
  }});
</script>
</body>
</html>
"""

    with open(output_path, "w") as f:
        f.write(html_out)
    print(f"wrote {output_path} with {count} candidates")

if __name__ == "__main__":
    main()
