const {initializeApp,cert}=require('firebase-admin/app');
const {getFirestore}=require('firebase-admin/firestore');
const fs=require('fs');

initializeApp({credential:cert(require('./serviceAccount.json'))});
const db=getFirestore();

db.collection('paginas_acoes').where('ativa','==',true).get().then(s=>{
  const urls=[
    'https://eliteacoes.com/',
    'https://eliteacoes.com/termos.html'
  ];
  s.docs.forEach(d=>{
    const data=d.data();
    if(data.url) urls.push('https://eliteacoes.com'+data.url+'.html');
  });
  const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    +urls.map(u=>'  <url><loc>'+u+'</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>').join('\n')
    +'\n</urlset>';
  fs.writeFileSync('../frontend/sitemap.xml',xml);
  console.log('✅ Sitemap gerado com',urls.length,'URLs');
  process.exit(0);
}).catch(e=>{console.error(e);process.exit(1);});
