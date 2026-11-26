import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderSvg } from '../skill/strata-atlas/scripts/core.mjs';

const gpu=JSON.parse(await readFile(new URL('../examples/gpu.json',import.meta.url)));
test('每张图中的放大对象与例题数量一致',()=>{
  const [grid,block,warp]=gpu.stages.map(s=>s.visual);
  assert.equal(grid.rows*grid.cols*block.rows*block.cols,4096);
  assert.equal(block.lit,warp.rows*warp.cols);
  assert.ok(renderSvg(gpu).svg.includes('4,096'));
});
test('图内引用可追溯，网址限制为网页地址',()=>{
  const s=structuredClone(gpu);
  s.notes[0].refs=[99];
  assert.throws(()=>renderSvg(s),/编号/);
  s.notes[0].refs=[1];
  s.sources[0].url='javascript:alert(1)';
  assert.throws(()=>renderSvg(s),/网址|网页/);
});
test('旧图稿仍可打开',()=>{
  const s={title:'试用',subtitle:'四个角色',layout:'grid',items:Array.from({length:4},()=>({title:'名称',detail:'说明',icon:'book'})),takeaway:'总结'};
  assert.ok(renderSvg(s).svg.includes('试用'));
});
