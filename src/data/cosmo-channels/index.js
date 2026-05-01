// 11 каналів космоенергетики — кожен по 12 клітинок (132 всього).
// Структура: 3 теорія + 3 практика + 3 на собі + 2 на інших + 1 сертифікат.

import tata from './tata.js';
import farunBudda from './farun-budda.js';
import farun from './farun.js';
import zevs from './zevs.js';
import simargl from './simargl.js';
import sutraKarma from './sutra-karma.js';
import kkr from './kkr.js';
import firast from './firast.js';
import kraon from './kraon.js';
import dzhilius from './dzhilius.js';
import goldPyramid from './gold-pyramid.js';

export { STAGES, stageOf } from './_helpers.js';

export const COSMO_CHANNELS = [
  tata, farunBudda, farun, zevs, simargl, sutraKarma, kkr,
  firast, kraon, dzhilius, goldPyramid,
];

export function findChannel(id) {
  return COSMO_CHANNELS.find((c) => c.id === id) || null;
}

export function getCellByIdx(channelId, idx) {
  const ch = findChannel(channelId);
  return ch?.cells?.[idx] || null;
}
