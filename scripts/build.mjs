import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { apps, websites } from './catalog.mjs';

process.chdir(fileURLToPath(new URL('../', import.meta.url)));
const projects = [...apps, ...websites];
const brand = 'Wonhee Jang';
const root = 'https://wonheejang.github.io';
const github = 'https://github.com/WONHEEJANG';
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const tag = '<span class="monogram" aria-hidden="true">wj<span>.</span></span>';
const header = `<a class="skip" href="#main">본문으로 이동</a><header class="top"><div class="wrap bar">
  <a class="brand" href="/">${tag} Wonhee Jang</a>
  <nav aria-label="주요 메뉴"><a href="/#projects">프로젝트</a><a class="github" href="${github}" lang="en">GitHub</a></nav>
</div></header>`;
const footer = `<footer><div class="wrap foot"><a class="brand" href="/">${tag} Wonhee Jang</a><a href="${github}">GitHub</a></div></footer>`;

function page(title, description, path, body, image) {
  return `<!doctype html>
<html lang="ko"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title><meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${root}${path}"><meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${root}${path}"><meta property="og:image" content="${root}${image}">
  <meta name="theme-color" content="#193ddc"><link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/portfolio.css"><script src="/portfolio.js" defer></script>
</head><body>${header}<main id="main">${body}</main>${footer}</body></html>\n`;
}
const screen = (p, n) => p.store ? `/media/${p.id}/${n}.webp` : `/media/web/${n}.webp`;
const icon = (p) => `/media/${p.id}/icon.webp`;
function art(p) {
  if (!p.store) return `<div class="web-art"><img src="${screen(p,p.screens[0][0])}" loading="lazy" alt=""></div>`;
  return `<div class="app-art" style="--tint:${p.color}"><div class="art-grid"></div>
    <img class="art-icon" src="${icon(p)}" alt="" loading="lazy">
    <span class="art-name">${p.english}</span>
    <div class="phone-pair" aria-hidden="true">${p.cover.map(i=>`<img class="phone" src="${screen(p,i)}" alt="" loading="lazy">`).join('')}</div>
  </div>`;
}
function card(p) {
  return `<article id="project-${p.id}" class="card" data-kind="${p.store?'apps':'web'}"><a href="/projects/${p.id}/">
    ${art(p)}<div class="card-info"><div class="meta"><span>${p.store?'iOS APP':'WEB APP'}</span><i></i>${p.category}</div>
    <h3>${p.name}</h3><p>${p.intro}</p></div></a></article>`;
}
const filters = [['all','전체',projects.length],['apps','iOS 앱',apps.length],['web','웹앱',websites.length]];
const home = `<section class="hero"><div class="wrap hero-grid">
  <div class="hero-copy"><p class="kicker"><span></span> DEVELOPER PORTFOLIO</p>
  <h1 lang="en">Wonhee<br>Jang<span>.</span></h1>
  <p class="intro">직접 만들고 운영하는 앱을 소개합니다.<br>출근길 지하철 알림부터 음악을 모으는 도구까지.</p></div>
  <div class="stage" role="img" aria-label="뛰어요, 디그셔너리, 한글뷰, 폰으로 트랙패드 앱 아이콘">
    <div class="plane"><div class="plane-grid"></div>${['metro','dig','hangul','pad'].map(key=>`<div class="tile tile-${key}"><img src="/media/${key}/icon.webp" alt="" fetchpriority="high"></div>`).join('')}</div>
  </div>
</div></section>
<section id="projects" class="wrap catalog"><div class="section-head"><div><p class="kicker dark"><span></span> PROJECT ARCHIVE</p>
  <h2>프로젝트</h2></div><div class="filters" aria-label="프로젝트 필터" role="group" hidden>${filters.map(([id,name,count])=>`<button type="button" data-filter="${id}" aria-pressed="${id==='all'}">${name} <small>${count}</small></button>`).join('')}</div></div>
  <div class="cards">${projects.map(card).join('\n')}</div></section>`;
writeFileSync('index.html',page('Wonhee Jang — 개발자 포트폴리오','Wonhee Jang이 개발하고 운영하는 iOS 앱과 공개 웹앱의 실제 화면과 기능을 살펴보세요.','/',home,'/media/cover.jpg'));

function projectPage(p) {
  const dest = p.store ? 'https://apps.apple.com/kr/app/id'+p.store : p.url;
  const next = projects[(projects.indexOf(p)+1)%projects.length];
  const pictures = p.screens.map(([id,label]) => `<figure><a href="${screen(p,id)}" data-zoom aria-label="${esc(label)} 크게 보기">
    <img src="${screen(p,id)}" loading="lazy" alt="${esc(p.name+' · '+label)}"></a><figcaption>${label}</figcaption></figure>`).join('');
  return `<div class="wrap detail"><a class="back" href="/#project-${p.id}">프로젝트 목록</a>
    <div class="detail-intro"><div><p class="kicker dark"><span></span> ${p.store?'iOS APP':'WEB APP'} &nbsp; / &nbsp; ${p.category}</p>
    <h1>${p.name}</h1><p class="lede">${p.intro}</p>
    <div class="actions"><a class="button" href="${dest}">${p.store?'App Store에서 보기':'웹앱 열기'}</a>
    ${(p.extra||[]).map(([label,url])=>`<a class="secondary" href="${url}">${label}</a>`).join('')}</div></div>
    ${art(p)}</div>
    <section class="features"><h2>주요 기능</h2><dl>${p.features.map(([title,detail])=>`<div><dt>${title}</dt><dd>${detail}</dd></div>`).join('')}</dl></section>
    <section class="screens"><h2>화면 살펴보기</h2><div class="gallery ${p.store?'mobile-shots':'web-shots'}">${pictures}</div></section>
    <div class="project-end"><a href="/#project-${p.id}">프로젝트 목록</a><a href="/projects/${next.id}/">다음 프로젝트 · ${next.name}</a></div></div>
    <dialog class="lightbox" aria-label="화면 크게 보기"><form method="dialog"><button class="close">닫기</button></form>
    <img class="expanded" alt=""><div class="light-nav"><button type="button" data-step="-1">이전</button><span aria-live="polite"></span><button type="button" data-step="1">다음</button></div></dialog>`;
}
for (const project of projects) {
  const path = '/projects/'+project.id+'/';
  mkdirSync('.'+path,{recursive:true});
  writeFileSync('.'+path+'index.html',page(project.name+' — '+brand,project.intro,path,projectPage(project),project.store?icon(project):screen(project,project.screens[0][0])));
}
