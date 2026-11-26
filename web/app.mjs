import { renderSvg } from '../skill/strata-atlas/scripts/core.mjs';
import { examples, webPrompt } from './examples.mjs';

const editor = document.getElementById('spec');
const map = document.getElementById('map');
const scroll = document.getElementById('preview-scroll');
const status = document.getElementById('status');
const stats = document.getElementById('map-stats');
const zoomLabel = document.getElementById('zoom-label');
const select = document.getElementById('example-select');
let current = null;
let zoom = 1;
let autoFit = true;
let language = 'en';
function msg(en, zh) { return language==='en' ? en : zh; }
function applyLanguage(next) {
  const pristine = !editor.value || editor.value===JSON.stringify(examples[language][select.value],null,2);
  language = next;
  document.documentElement.lang = next;
  document.querySelectorAll('[data-zh]').forEach(el => {
    el.dataset.en ??= el.textContent;
    el.textContent = msg(el.dataset.en, el.dataset.zh);
  });
  document.querySelectorAll('[data-zh-aria]').forEach(el => {
    el.dataset.enAria ??= el.getAttribute('aria-label');
    el.setAttribute('aria-label', msg(el.dataset.enAria, el.dataset.zhAria));
  });
  const button=document.getElementById('language');
  button.textContent=msg('简体中文','English');
  button.lang=msg('zh-CN','en');
  if(pristine) setExample(select.value); else render();
}
document.getElementById('language').addEventListener('click',()=>applyLanguage(msg('zh-CN','en')));

function notify(message, error = false) {
  status.textContent = message;
  status.classList.toggle('error', error);
}

function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function filename(extension) {
  const title = (current?.spec.title || 'one-picture').replace(/[\\/:*?"<>|]/g, '').slice(0, 36);
  return (title || 'one-picture') + '.' + extension;
}

function applyZoom() {
  if (!current) return;
  if (autoFit) zoom = Math.min(1, (scroll.clientWidth - 36) / current.width, (scroll.clientHeight - 36) / current.height);
  zoom = Math.max(0.2, Math.min(6, zoom));
  const svg = map.querySelector('svg');
  if (!svg) return;
  svg.style.width = Math.round(current.width * zoom) + 'px';
  svg.style.height = Math.round(current.height * zoom) + 'px';
  zoomLabel.textContent = Math.round(zoom * 100) + '%';
}

function render() {
  try {
    current = renderSvg(JSON.parse(editor.value));
    map.innerHTML = current.svg;
    stats.textContent = {mechanism:msg('Technical mechanism','运行原理'), industry:msg('Industry value chain','产业链条')}[current.spec.mode] || msg('Classic diagram','经典图稿');
    applyZoom();
    notify(msg('Preview updated','图文已更新'));
  } catch (error) {
    current = null;
    map.textContent = '';
    stats.textContent = '';
    notify(error instanceof SyntaxError ? msg('Invalid JSON. Check commas and quotation marks.','JSON 格式有误，请检查逗号和引号。') : error.message, true);
  }
}

function setExample(key) {
  editor.value = JSON.stringify(examples[language][key], null, 2);
  autoFit = true;
  render();
}

select.addEventListener('change', () => setExample(select.value));
editor.addEventListener('input', render);
window.addEventListener('resize', applyZoom);
document.getElementById('fit').addEventListener('click', () => { autoFit = true; applyZoom(); });
document.getElementById('zoom-in').addEventListener('click', () => { autoFit = false; zoom += 0.2; applyZoom(); });
document.getElementById('zoom-out').addEventListener('click', () => { autoFit = false; zoom -= 0.2; applyZoom(); });
document.getElementById('download-json').addEventListener('click', () => {
  if (!current) return notify(msg('Fix the specification before exporting.','请先修正图文数据。'), true);
  download(new Blob([JSON.stringify(current.spec, null, 2) + '\n'], { type: 'application/json;charset=utf-8' }), filename('json'));
  notify(msg('JSON exported','已下载可编辑稿'));
});
document.getElementById('download-svg').addEventListener('click', () => {
  if (!current) return notify(msg('Fix the specification before exporting.','请先修正图文数据。'), true);
  download(new Blob([current.svg], { type: 'image/svg+xml;charset=utf-8' }), filename('svg'));
  notify(msg('SVG exported','已导出 SVG'));
});
document.getElementById('download-png').addEventListener('click', () => {
  if (!current) return notify(msg('Fix the specification before exporting.','请先修正图文数据。'), true);
  const canvas = document.createElement('canvas');
  canvas.width = current.width * 2;
  canvas.height = current.height * 2;
  const context = canvas.getContext('2d');
  if (!context) return notify(msg('This browser could not create a PNG.','当前浏览器无法创建 PNG。'), true);
  const image = new Image();
  const url = URL.createObjectURL(new Blob([current.svg], { type: 'image/svg+xml;charset=utf-8' }));
  image.onload = () => {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    canvas.toBlob((blob) => {
      if (blob) { download(blob, filename('png')); notify(msg('2× PNG exported','已导出 2× PNG')); }
      else notify(msg('PNG export failed.','PNG 导出失败。'), true);
    }, 'image/png');
  };
  image.onerror = () => { URL.revokeObjectURL(url); notify(msg('PNG export failed.','PNG 导出失败。'), true); };
  image.src = url;
});
document.getElementById('copy-prompt').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(webPrompt[language]); notify(msg('Prompt copied','已复制 AI 生成指令')); }
  catch { download(new Blob([webPrompt[language]], { type: 'text/plain;charset=utf-8' }), msg('layerlens-web-prompt.txt','layerlens-web-prompt.zh-CN.txt')); notify(msg('Prompt downloaded as a text file','已提供可复制的指令文件')); }
});

applyLanguage(location.hash==='#zh-CN'?'zh-CN':'en');
