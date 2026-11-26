export const ICONS = ['target', 'spark', 'search', 'book', 'link', 'gear', 'check', 'shield', 'clock', 'people', 'chart', 'warning'];
const COLORS = [
  { strong: '#126b75', light: '#d9f3f0' },
  { strong: '#6655b8', light: '#eeeaff' },
  { strong: '#c46932', light: '#fff0df' },
  { strong: '#2d6da8', light: '#e4f1ff' },
  { strong: '#a84e78', light: '#ffe9f2' }
];

function units(text) {
  return Array.from(text).reduce((n, char) => n + (/[\u2e80-\uffff]/.test(char) ? 2 : 1), 0);
}

function requiredText(value, label, limit) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(label + '不能为空。');
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (units(normalized) > limit) throw new Error(label + '过长，请精简后再试。');
  return normalized;
}

export function validateSpec(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('请输入 JSON 对象。');
  const layout = input.layout;
  if (!['flow', 'grid'].includes(layout)) throw new Error('layout 只支持 flow 或 grid。');
  if (!Array.isArray(input.items)) throw new Error('items 必须是数组。');
  if (layout === 'flow' && (input.items.length < 4 || input.items.length > 5)) throw new Error('flow 需要 4–5 个模块。');
  if (layout === 'grid' && input.items.length !== 4) throw new Error('grid 需要 4 个模块。');
  const items = input.items.map((item, index) => {
    if (!item || typeof item !== 'object') throw new Error('第 ' + (index + 1) + ' 个模块无效。');
    if (!ICONS.includes(item.icon)) throw new Error('第 ' + (index + 1) + ' 个模块的 icon 不受支持。');
    const points = item.points ?? [];
    if (!Array.isArray(points) || points.length > 2) throw new Error('每个模块最多有两个要点。');
    return {
      title: requiredText(item.title, '模块标题', 20),
      detail: requiredText(item.detail, '模块说明', 88),
      icon: item.icon,
      points: points.map((point) => requiredText(point, '模块要点', 21))
    };
  });
  return {
    title: requiredText(input.title, '主标题', 46),
    subtitle: requiredText(input.subtitle, '副标题', 90),
    layout,
    items,
    takeaway: requiredText(input.takeaway, '核心结论', 110),
    source: input.source == null || input.source === '' ? '' : requiredText(input.source, '来源说明', 100)
  };
}

function xml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function wrap(text, maxUnits) {
  const lines = [];
  let current = '';
  let length = 0;
  for (const char of Array.from(text)) {
    const size = /[\u2e80-\uffff]/.test(char) ? 2 : 1;
    if (length + size > maxUnits && current) {
      const breakAt = current.lastIndexOf(' ');
      if (breakAt > Math.floor(current.length / 2)) {
        lines.push(current.slice(0, breakAt).trim());
        current = current.slice(breakAt + 1);
        length = units(current);
      } else {
        lines.push(current.trim());
        current = '';
        length = 0;
      }
    }
    current += char;
    length += size;
  }
  if (current.trim()) lines.push(current.trim());
  return lines;
}

function textBlock(text, x, y, maxUnits, lineHeight, attrs) {
  const lines = wrap(text, maxUnits);
  return '<text x="' + x + '" y="' + y + '" ' + attrs + '>' +
    lines.map((line, i) => '<tspan x="' + x + '" dy="' + (i ? lineHeight : 0) + '">' + xml(line) + '</tspan>').join('') +
    '</text>';
}

function icon(name, x, y, color) {
  const paths = {
    target: '<circle cx="0" cy="0" r="22"/><circle cx="0" cy="0" r="11"/><circle cx="0" cy="0" r="2" fill="currentColor" stroke="none"/>',
    spark: '<path d="M0-27 6-7 26 0 6 7 0 27-6 7-26 0-6-7Z"/><path d="M25-24v11m-5-5h10"/>',
    search: '<circle cx="-4" cy="-5" r="17"/><path d="m9 8 17 17"/>',
    book: '<path d="M0-21c-10-7-21-6-27-4v45c9-3 20-3 27 3 7-6 18-6 27-3v-45c-6-2-17-3-27 4Z"/><path d="M0-21v44"/>',
    link: '<path d="M-9-9-1-17a13 13 0 0 1 19 19l-8 8M9 9l-8 8a13 13 0 0 1-19-19l8-8"/><path d="m-9 9 18-18"/>',
    gear: '<circle r="11"/><path d="M-4-27h8l2 6 6 3 6-3 6 7-4 5 1 7 5 4-3 8-7 1-5 5v7h-8l-2-6-6-3-6 3-6-7 4-5-1-7-5-4 3-8 7-1 5-5Z"/>',
    check: '<circle r="25"/><path d="m-13 0 9 9 18-20"/>',
    shield: '<path d="M0-27 22-18v17c0 15-10 24-22 29C-12 23-22 14-22-1v-17Z"/><path d="m-9 0 7 7 12-14"/>',
    clock: '<circle r="25"/><path d="M0-15V1l12 7"/>',
    people: '<circle cx="-10" cy="-10" r="9"/><circle cx="14" cy="-7" r="7"/><path d="M-28 19c0-12 8-19 18-19S8 7 8 19M9 5c11-4 21 3 21 14"/>',
    chart: '<path d="M-28 24h56M-24 15v-12h11v12M-5 15v-26H6v26M14 15v-40h11v40"/>',
    warning: '<path d="M0-27 28 23h-56Z"/><path d="M0-10V7"/><circle cx="0" cy="16" r="1" fill="currentColor" stroke="none"/>'
  };
  return '<g transform="translate(' + x + ' ' + y + ')" color="' + color + '" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' + paths[name] + '</g>';
}

function header(parts, spec, height) {
  parts.push('<rect width="1600" height="' + height + '" fill="#f3f8fb"/>');
  parts.push('<circle cx="1510" cy="30" r="250" fill="#e6f3f5"/>');
  parts.push('<circle cx="1500" cy="50" r="170" fill="#deecf7" opacity=".7"/>');
  parts.push('<circle cx="70" cy="' + (height - 15) + '" r="180" fill="#e7f3f4"/>');
  parts.push('<rect x="68" y="52" width="122" height="34" rx="17" fill="#d8eeef"/>');
  parts.push('<text x="129" y="75" text-anchor="middle" fill="#126b75" font-size="17" font-weight="750">一图看懂</text>');
  parts.push(textBlock(spec.title, 68, 158, 46, 58, 'fill="#14283a" font-size="52" font-weight="800" letter-spacing="-1"'));
  parts.push(textBlock(spec.subtitle, 70, 221, 90, 31, 'fill="#56717c" font-size="24" font-weight="450"'));
  parts.push('<line x1="70" y1="263" x2="1530" y2="263" stroke="#cbdde3" stroke-width="2"/>');
}

function footer(parts, spec, y, height) {
  parts.push('<rect x="68" y="' + y + '" width="1464" height="' + height + '" rx="25" fill="#14283a"/>');
  parts.push('<rect x="92" y="' + (y + 22) + '" width="6" height="' + (height - 44) + '" rx="3" fill="#6ee0cf"/>');
  parts.push('<text x="122" y="' + (y + 42) + '" fill="#8ee2d2" font-size="18" font-weight="750">记住这一点</text>');
  parts.push(textBlock(spec.takeaway, 122, y + 80, 92, 31, 'fill="#ffffff" font-size="25" font-weight="650"'));
  if (spec.source) parts.push(textBlock('来源说明：' + spec.source, 72, y + height + 31, 120, 22, 'fill="#6d8790" font-size="16"'));
}

function flowCard(parts, item, index, count) {
  const x = count === 5 ? 68 + index * 294 : 68 + index * 370;
  const w = count === 5 ? 276 : 352;
  const y = 320;
  const c = COLORS[index];
  parts.push('<rect x="' + x + '" y="' + y + '" width="' + w + '" height="414" rx="25" fill="#ffffff" stroke="#d9e6eb" stroke-width="2"/>');
  parts.push('<rect x="' + (x + 25) + '" y="' + (y + 25) + '" width="76" height="76" rx="22" fill="' + c.light + '"/>');
  parts.push(icon(item.icon, x + 63, y + 63, c.strong));
  parts.push('<text x="' + (x + w - 30) + '" y="' + (y + 61) + '" text-anchor="end" fill="' + c.strong + '" font-size="24" font-weight="800">0' + (index + 1) + '</text>');
  parts.push(textBlock(item.title, x + 26, y + 147, count === 5 ? 22 : 29, 34, 'fill="#14283a" font-size="27" font-weight="750"'));
  parts.push(textBlock(item.detail, x + 26, y + 194, count === 5 ? 23 : 30, 29, 'fill="#4f6874" font-size="21"'));
  parts.push('<line x1="' + (x + 25) + '" y1="' + (y + 308) + '" x2="' + (x + w - 25) + '" y2="' + (y + 308) + '" stroke="#e2ebee" stroke-width="2"/>');
  item.points.forEach((point, i) => {
    parts.push('<circle cx="' + (x + 34) + '" cy="' + (y + 339 + i * 32) + '" r="5" fill="' + c.strong + '"/>');
    parts.push(textBlock(point, x + 48, y + 346 + i * 32, count === 5 ? 21 : 29, 23, 'fill="#284653" font-size="18" font-weight="550"'));
  });
  if (index < count - 1) {
    const start = x + w + 2;
    const end = count === 5 ? start + 15 : start + 14;
    parts.push('<path d="M' + start + ' ' + (y + 207) + 'h' + (end - start) + 'm-7-7 7 7-7 7" fill="none" stroke="#8ca7af" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>');
  }
}

function gridCard(parts, item, index) {
  const x = index % 2 ? 818 : 68;
  const y = index < 2 ? 310 : 604;
  const c = COLORS[index];
  parts.push('<rect x="' + x + '" y="' + y + '" width="714" height="270" rx="27" fill="#ffffff" stroke="#d9e6eb" stroke-width="2"/>');
  parts.push('<rect x="' + (x + 27) + '" y="' + (y + 28) + '" width="88" height="88" rx="26" fill="' + c.light + '"/>');
  parts.push(icon(item.icon, x + 71, y + 72, c.strong));
  parts.push('<text x="' + (x + 140) + '" y="' + (y + 62) + '" fill="' + c.strong + '" font-size="18" font-weight="800">关键动作 0' + (index + 1) + '</text>');
  parts.push(textBlock(item.title, x + 140, y + 105, 39, 35, 'fill="#14283a" font-size="31" font-weight="750"'));
  parts.push(textBlock(item.detail, x + 140, y + 153, 47, 29, 'fill="#4f6874" font-size="21"'));
  item.points.forEach((point, i) => {
    const px = x + 30 + i * 335;
    parts.push('<rect x="' + px + '" y="' + (y + 218) + '" width="315" height="34" rx="17" fill="' + c.light + '"/>');
    parts.push(textBlock(point, px + 15, y + 241, 33, 20, 'fill="' + c.strong + '" font-size="17" font-weight="650"'));
  });
}

export function renderSvg(input) {
  const spec = validateSpec(input);
  const height = spec.layout === 'flow' ? 950 : 1090;
  const parts = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="' + height + '" viewBox="0 0 1600 ' + height + '" role="img" aria-labelledby="title desc">',
    '<title id="title">' + xml(spec.title) + '</title>',
    '<desc id="desc">' + xml(spec.subtitle + ' ' + spec.takeaway) + '</desc>',
    '<g font-family="system-ui, -apple-system, PingFang SC, Microsoft YaHei, sans-serif">'
  ];
  header(parts, spec, height);
  if (spec.layout === 'flow') {
    spec.items.forEach((item, i) => flowCard(parts, item, i, spec.items.length));
    footer(parts, spec, 772, 135);
  } else {
    spec.items.forEach((item, i) => gridCard(parts, item, i));
    footer(parts, spec, 913, 135);
  }
  parts.push('</g></svg>');
  return { svg: parts.join(''), width: 1600, height, spec };
}
