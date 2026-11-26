import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderSvg } from '../skill/strata-atlas/scripts/core.mjs';

const gpu=JSON.parse(await readFile(new URL('../examples/gpu.json',import.meta.url)));
test('Highlighted objects match the number of threads in the example',()=>{
  const [grid,block,warp]=gpu.stages.map(s=>s.visual);
  assert.equal(grid.rows*grid.cols*block.rows*block.cols,4096);
  assert.equal(block.lit,warp.rows*warp.cols);
  assert.ok(renderSvg(gpu).svg.includes('4,096'));
});
test('Validate source references and reject non-web URLs',()=>{
  const s=structuredClone(gpu);
  s.notes[0].refs=[99];
  assert.throws(()=>renderSvg(s),/Reference/);
  s.notes[0].refs=[1];
  s.sources[0].url='javascript:alert(1)';
  assert.throws(()=>renderSvg(s),/URL/);
});
test('English diagrams have English labels and older Chinese files retain their language', async () => {
  const english = renderSvg(gpu);
  assert.equal(english.spec.lang, 'en');
  assert.match(english.svg, />Sources</);
  assert.doesNotMatch(english.svg, /[\u3400-\u9fff]/u);
  const chinese = JSON.parse(await readFile(new URL('../examples/zh-CN/gpu.json', import.meta.url)));
  delete chinese.lang;
  const older = renderSvg(chinese);
  assert.equal(older.spec.lang, 'zh-CN');
  assert.match(older.svg, />资料索引</);
});
test('Legacy diagrams still render',()=>{
  const s={title:'试用',subtitle:'四个角色',layout:'grid',items:Array.from({length:4},()=>({title:'名称',detail:'说明',icon:'book'})),takeaway:'总结'};
  assert.ok(renderSvg(s).svg.includes('试用'));
});
