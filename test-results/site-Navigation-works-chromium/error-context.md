# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: site.spec.ts >> Navigation works
- Location: tests\e2e\site.spec.ts:8:5

# Error details

```
Error: locator.isVisible: Error: strict mode violation: getByRole('link', { name: /blog/i }) resolved to 2 elements:
    1) <a href="/blog" class="text-sm font-medium text-white/70 hover:text-white transition-colors">Blog</a> aka getByRole('link', { name: 'Blog', exact: true })
    2) <a href="/blog" class="hover:text-accent transition-colors">Blog Imobiliário</a> aka getByRole('link', { name: 'Blog Imobiliário' })

Call log:
    - checking visibility of getByRole('link', { name: /blog/i })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e5]:
        - generic [ref=e6]:
          - img [ref=e8]
          - generic [ref=e11]: Habita.vc
        - generic [ref=e12]:
          - link "Início" [ref=e13] [cursor=pointer]:
            - /url: /
          - link "Imóveis" [ref=e14] [cursor=pointer]:
            - /url: /imoveis
          - link "Empreendimentos" [ref=e15] [cursor=pointer]:
            - /url: /empreendimentos
          - link "Blog" [ref=e16] [cursor=pointer]:
            - /url: /blog
        - generic [ref=e17]:
          - button [ref=e18]:
            - img [ref=e19]
          - link "CRM Habita" [ref=e22] [cursor=pointer]:
            - /url: /crmhabita
            - img [ref=e23]
            - text: CRM Habita
    - main [ref=e28]:
      - heading "Habita.vc - Portal Imobiliário Premium em Goiânia" [level=1] [ref=e29]
      - generic [ref=e30]:
        - img "Luxury Real Estate" [ref=e32]
        - generic [ref=e34]:
          - generic [ref=e35]:
            - generic [ref=e36]:
              - heading "Encontre o seu próximo momento." [level=1] [ref=e37]:
                - text: Encontre o seu
                - text: próximo momento.
              - paragraph [ref=e38]: Descubra as melhores casas, apartamentos e lançamentos em Goiânia com curadoria de especialistas.
            - generic [ref=e39]:
              - generic [ref=e40]:
                - button "comprar" [ref=e41]
                - button "alugar" [ref=e42]
                - button "lançamentos" [ref=e43]
              - generic [ref=e44]:
                - generic [ref=e45]:
                  - img [ref=e46]
                  - textbox "Cidade, bairro ou condomínio" [ref=e49]
                - generic [ref=e51]:
                  - img [ref=e52]
                  - combobox [ref=e55] [cursor=pointer]:
                    - option "Tipo de imóvel" [selected]
                    - option "Apartamento"
                    - option "Casa de Condomínio"
                    - option "Penthouse"
                    - option "Lote"
                - combobox [ref=e60] [cursor=pointer]:
                  - option "Faixa de Preço" [selected]
                  - option "Até R$ 500k"
                  - option "R$ 500k - R$ 1.5M"
                  - option "R$ 1.5M - R$ 5M"
                  - option "Acima de R$ 5M"
                - button "BUSCAR" [ref=e61]:
                  - text: BUSCAR
                  - img [ref=e62]
          - generic [ref=e64]:
            - paragraph [ref=e65]: Bairros mais buscados
            - button "Setor Marista" [ref=e66]
            - button "Setor Bueno" [ref=e67]
            - button "Jardim Goiás" [ref=e68]
            - button "Alphaville" [ref=e69]
            - button "Setor Oeste" [ref=e70]
      - generic [ref=e72]:
        - generic [ref=e73]:
          - generic [ref=e74]:
            - heading "Imóveis em Destaque" [level=2] [ref=e75]
            - paragraph [ref=e76]: Uma seleção exclusiva das melhores oportunidades de mercado, curadas por nossos especialistas em alta performance.
          - link "Ver todos os imóveis" [ref=e77] [cursor=pointer]:
            - /url: /imoveis
            - text: Ver todos os imóveis
            - img [ref=e78]
        - img [ref=e81]
      - generic [ref=e84]:
        - generic [ref=e85]:
          - generic [ref=e86]:
            - heading "Lançamentos Imperdíveis" [level=2] [ref=e87]:
              - text: Lançamentos
              - text: Imperdíveis
            - paragraph [ref=e88]: As maiores oportunidades de investimento e moradia que acabaram de chegar ao mercado.
          - button "Explorar Lançamentos" [ref=e89]
        - generic [ref=e90]:
          - generic [ref=e91]:
            - img "Launch" [ref=e92]
            - generic [ref=e94]:
              - generic [ref=e95]: Exclusivo Habita.vc
              - heading "Lançamento Marista Premium" [level=3] [ref=e96]
              - img [ref=e98]
          - generic [ref=e100]:
            - img "Launch" [ref=e101]
            - generic [ref=e103]:
              - generic [ref=e104]: Exclusivo Habita.vc
              - heading "Lançamento Marista Premium" [level=3] [ref=e105]
              - img [ref=e107]
          - generic [ref=e109]:
            - img "Launch" [ref=e110]
            - generic [ref=e112]:
              - generic [ref=e113]: Exclusivo Habita.vc
              - heading "Lançamento Marista Premium" [level=3] [ref=e114]
              - img [ref=e116]
          - generic [ref=e118]:
            - img "Launch" [ref=e119]
            - generic [ref=e121]:
              - generic [ref=e122]: Exclusivo Habita.vc
              - heading "Lançamento Marista Premium" [level=3] [ref=e123]
              - img [ref=e125]
      - generic [ref=e128]:
        - generic [ref=e129]:
          - generic [ref=e130]:
            - heading "Explore por Região" [level=2] [ref=e131]
            - paragraph [ref=e132]: Encontre o lugar ideal para sua família nos bairros mais valorizados e desejados de Goiânia.
          - generic [ref=e133]: Viver em Alta Performance
        - generic [ref=e135]:
          - link "Setor Bueno Goiania Setor Bueno 124 imóveis exclusivos" [ref=e136] [cursor=pointer]:
            - /url: /imoveis/goiania?bairro=setor-bueno
            - img "Setor Bueno" [ref=e137]
            - generic [ref=e139]:
              - generic [ref=e140]:
                - img [ref=e141]
                - generic [ref=e144]: Goiania
              - heading "Setor Bueno" [level=3] [ref=e145]
              - generic [ref=e146]:
                - paragraph [ref=e147]: 124 imóveis exclusivos
                - img [ref=e149]
          - link "Setor Marista Goiania Setor Marista 85 imóveis exclusivos" [ref=e151] [cursor=pointer]:
            - /url: /imoveis/goiania?bairro=setor-marista
            - img "Setor Marista" [ref=e152]
            - generic [ref=e154]:
              - generic [ref=e155]:
                - img [ref=e156]
                - generic [ref=e159]: Goiania
              - heading "Setor Marista" [level=3] [ref=e160]
              - generic [ref=e161]:
                - paragraph [ref=e162]: 85 imóveis exclusivos
                - img [ref=e164]
          - link "Alphaville Goiania Alphaville 42 imóveis exclusivos" [ref=e166] [cursor=pointer]:
            - /url: /imoveis/goiania?bairro=alphaville
            - img "Alphaville" [ref=e167]
            - generic [ref=e169]:
              - generic [ref=e170]:
                - img [ref=e171]
                - generic [ref=e174]: Goiania
              - heading "Alphaville" [level=3] [ref=e175]
              - generic [ref=e176]:
                - paragraph [ref=e177]: 42 imóveis exclusivos
                - img [ref=e179]
          - link "Jardim Goiás Goiania Jardim Goiás 67 imóveis exclusivos" [ref=e181] [cursor=pointer]:
            - /url: /imoveis/goiania?bairro=jardim-goias
            - img "Jardim Goiás" [ref=e182]
            - generic [ref=e184]:
              - generic [ref=e185]:
                - img [ref=e186]
                - generic [ref=e189]: Goiania
              - heading "Jardim Goiás" [level=3] [ref=e190]
              - generic [ref=e191]:
                - paragraph [ref=e192]: 67 imóveis exclusivos
                - img [ref=e194]
          - link "Setor Oeste Goiania Setor Oeste 53 imóveis exclusivos" [ref=e196] [cursor=pointer]:
            - /url: /imoveis/goiania?bairro=setor-oeste
            - img "Setor Oeste" [ref=e197]
            - generic [ref=e199]:
              - generic [ref=e200]:
                - img [ref=e201]
                - generic [ref=e204]: Goiania
              - heading "Setor Oeste" [level=3] [ref=e205]
              - generic [ref=e206]:
                - paragraph [ref=e207]: 53 imóveis exclusivos
                - img [ref=e209]
          - link "Parque Amazônia Goiania Parque Amazônia 91 imóveis exclusivos" [ref=e211] [cursor=pointer]:
            - /url: /imoveis/goiania?bairro=parque-amazonia
            - img "Parque Amazônia" [ref=e212]
            - generic [ref=e214]:
              - generic [ref=e215]:
                - img [ref=e216]
                - generic [ref=e219]: Goiania
              - heading "Parque Amazônia" [level=3] [ref=e220]
              - generic [ref=e221]:
                - paragraph [ref=e222]: 91 imóveis exclusivos
                - img [ref=e224]
      - generic [ref=e230]:
        - generic [ref=e231]:
          - heading "Oportunidade do Dia." [level=2] [ref=e232]:
            - text: Oportunidade
            - text: do Dia.
          - paragraph [ref=e233]: Uma curadoria única de imóveis com valor abaixo de mercado, selecionada por nossa inteligência de dados.
          - button "Ver Oportunidade" [ref=e234]
        - img "Oportunidade" [ref=e237]
      - generic [ref=e239]:
        - generic [ref=e240]:
          - heading "Corretores Verificados" [level=2] [ref=e241]
          - paragraph [ref=e242]: Os melhores especialistas do mercado imobiliário prontos para te atender.
        - generic [ref=e243]:
          - generic [ref=e244]:
            - generic [ref=e245]:
              - img "Broker" [ref=e247]
              - img [ref=e249]
            - generic [ref=e252]:
              - paragraph [ref=e253]: Consultor 1
              - paragraph [ref=e254]: Especialista Marista
          - generic [ref=e255]:
            - generic [ref=e256]:
              - img "Broker" [ref=e258]
              - img [ref=e260]
            - generic [ref=e263]:
              - paragraph [ref=e264]: Consultor 2
              - paragraph [ref=e265]: Especialista Marista
          - generic [ref=e266]:
            - generic [ref=e267]:
              - img "Broker" [ref=e269]
              - img [ref=e271]
            - generic [ref=e274]:
              - paragraph [ref=e275]: Consultor 3
              - paragraph [ref=e276]: Especialista Marista
          - generic [ref=e277]:
            - generic [ref=e278]:
              - img "Broker" [ref=e280]
              - img [ref=e282]
            - generic [ref=e285]:
              - paragraph [ref=e286]: Consultor 4
              - paragraph [ref=e287]: Especialista Marista
          - generic [ref=e288]:
            - generic [ref=e289]:
              - img "Broker" [ref=e291]
              - img [ref=e293]
            - generic [ref=e296]:
              - paragraph [ref=e297]: Consultor 5
              - paragraph [ref=e298]: Especialista Marista
          - generic [ref=e299]:
            - generic [ref=e300]:
              - img "Broker" [ref=e302]
              - img [ref=e304]
            - generic [ref=e307]:
              - paragraph [ref=e308]: Consultor 6
              - paragraph [ref=e309]: Especialista Marista
      - generic [ref=e312]:
        - heading "É Corretor ou Imobiliária?" [level=2] [ref=e313]:
          - text: É Corretor ou
          - text: Imobiliária?
        - paragraph [ref=e314]: Anuncie seus imóveis no portal que mais cresce em Goiânia e conecte-se com clientes qualificados.
        - generic [ref=e315]:
          - button "Anunciar Imóveis" [ref=e316]
          - button "Conhecer o CRM" [ref=e317]
    - contentinfo [ref=e318]:
      - generic [ref=e319]:
        - generic [ref=e320]:
          - generic [ref=e321]:
            - generic [ref=e322]: Habita.vc
            - paragraph [ref=e323]: O marketplace imobiliário inteligente de Goiânia. Encontre casas, apartamentos e oportunidades únicas.
          - generic [ref=e324]:
            - heading "Portal" [level=4] [ref=e325]
            - list [ref=e326]:
              - listitem [ref=e327]:
                - link "Buscar Imóveis" [ref=e328] [cursor=pointer]:
                  - /url: /imoveis
              - listitem [ref=e329]:
                - link "Lançamentos" [ref=e330] [cursor=pointer]:
                  - /url: /empreendimentos
              - listitem [ref=e331]:
                - link "Blog Imobiliário" [ref=e332] [cursor=pointer]:
                  - /url: /blog
              - listitem [ref=e333]:
                - link "Entrar / Cadastrar" [ref=e334] [cursor=pointer]:
                  - /url: /login
          - generic [ref=e335]:
            - heading "Cidades" [level=4] [ref=e336]
            - list [ref=e337]:
              - listitem [ref=e338] [cursor=pointer]: Goiânia
              - listitem [ref=e339]: Aparecida de Goiânia
              - listitem [ref=e340]: Anápolis
              - listitem [ref=e341]: Senador Canedo
        - generic [ref=e342]:
          - paragraph [ref=e343]: © 2026 Habita.vc • O Portal Imobiliário de Goiânia
          - generic [ref=e344]:
            - generic [ref=e345] [cursor=pointer]: Instagram
            - generic [ref=e346] [cursor=pointer]: LinkedIn
            - generic [ref=e347] [cursor=pointer]: YouTube
  - button "Open Next.js Dev Tools" [ref=e353] [cursor=pointer]:
    - img [ref=e354]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('Home page loads and has correct title', async ({ page }) => {
  4  |   await page.goto('/');
  5  |   await expect(page).toHaveTitle(/Habita.vc/i);
  6  | });
  7  | 
  8  | test('Navigation works', async ({ page }) => {
  9  |   await page.goto('/');
  10 |   // Assume there is a link to Blog or Portal
  11 |   const blogLink = page.getByRole('link', { name: /blog/i });
> 12 |   if (await blogLink.isVisible()) {
     |                      ^ Error: locator.isVisible: Error: strict mode violation: getByRole('link', { name: /blog/i }) resolved to 2 elements:
  13 |     await blogLink.click();
  14 |     await expect(page).toHaveURL(/.*blog/);
  15 |   }
  16 | });
  17 | 
```