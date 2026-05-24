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
          - generic [ref=e65]:
            - paragraph [ref=e66]: Bairros mais buscados
            - button "Setor Marista" [ref=e67]
            - button "Setor Bueno" [ref=e68]
            - button "Jardim Goiás" [ref=e69]
            - button "Alphaville" [ref=e70]
            - button "Setor Oeste" [ref=e71]
      - generic [ref=e73]:
        - generic [ref=e74]:
          - generic [ref=e75]:
            - heading "Imóveis em Destaque" [level=2] [ref=e76]
            - paragraph [ref=e77]: Uma seleção exclusiva das melhores oportunidades de mercado, curadas por nossos especialistas em alta performance.
          - link "Ver todos os imóveis" [ref=e78] [cursor=pointer]:
            - /url: /imoveis
            - text: Ver todos os imóveis
            - img [ref=e79]
        - img [ref=e83]
      - generic [ref=e86]:
        - generic [ref=e87]:
          - generic [ref=e88]:
            - heading "Lançamentos Imperdíveis" [level=2] [ref=e89]:
              - text: Lançamentos
              - text: Imperdíveis
            - paragraph [ref=e90]: As maiores oportunidades de investimento e moradia que acabaram de chegar ao mercado.
          - button "Explorar Lançamentos" [ref=e91]
        - generic [ref=e92]:
          - generic [ref=e93]:
            - img "Launch" [ref=e94]
            - generic [ref=e96]:
              - generic [ref=e97]: Exclusivo Habita.vc
              - heading "Lançamento Marista Premium" [level=3] [ref=e98]
              - img [ref=e100]
          - generic [ref=e103]:
            - img "Launch" [ref=e104]
            - generic [ref=e106]:
              - generic [ref=e107]: Exclusivo Habita.vc
              - heading "Lançamento Marista Premium" [level=3] [ref=e108]
              - img [ref=e110]
          - generic [ref=e113]:
            - img "Launch" [ref=e114]
            - generic [ref=e116]:
              - generic [ref=e117]: Exclusivo Habita.vc
              - heading "Lançamento Marista Premium" [level=3] [ref=e118]
              - img [ref=e120]
          - generic [ref=e123]:
            - img "Launch" [ref=e124]
            - generic [ref=e126]:
              - generic [ref=e127]: Exclusivo Habita.vc
              - heading "Lançamento Marista Premium" [level=3] [ref=e128]
              - img [ref=e130]
      - generic [ref=e134]:
        - generic [ref=e135]:
          - generic [ref=e136]:
            - heading "Explore por Região" [level=2] [ref=e137]
            - paragraph [ref=e138]: Encontre o lugar ideal para sua família nos bairros mais valorizados e desejados de Goiânia.
          - generic [ref=e139]: Viver em Alta Performance
        - generic [ref=e141]:
          - link "Setor Bueno Goiania Setor Bueno 124 imóveis exclusivos" [ref=e142] [cursor=pointer]:
            - /url: /imoveis/goiania?bairro=setor-bueno
            - img "Setor Bueno" [ref=e143]
            - generic [ref=e145]:
              - generic [ref=e146]:
                - img [ref=e147]
                - generic [ref=e150]: Goiania
              - heading "Setor Bueno" [level=3] [ref=e151]
              - generic [ref=e152]:
                - paragraph [ref=e153]: 124 imóveis exclusivos
                - img [ref=e155]
          - link "Setor Marista Goiania Setor Marista 85 imóveis exclusivos" [ref=e157] [cursor=pointer]:
            - /url: /imoveis/goiania?bairro=setor-marista
            - img "Setor Marista" [ref=e158]
            - generic [ref=e160]:
              - generic [ref=e161]:
                - img [ref=e162]
                - generic [ref=e165]: Goiania
              - heading "Setor Marista" [level=3] [ref=e166]
              - generic [ref=e167]:
                - paragraph [ref=e168]: 85 imóveis exclusivos
                - img [ref=e170]
          - link "Alphaville Goiania Alphaville 42 imóveis exclusivos" [ref=e172] [cursor=pointer]:
            - /url: /imoveis/goiania?bairro=alphaville
            - img "Alphaville" [ref=e173]
            - generic [ref=e175]:
              - generic [ref=e176]:
                - img [ref=e177]
                - generic [ref=e180]: Goiania
              - heading "Alphaville" [level=3] [ref=e181]
              - generic [ref=e182]:
                - paragraph [ref=e183]: 42 imóveis exclusivos
                - img [ref=e185]
          - link "Jardim Goiás Goiania Jardim Goiás 67 imóveis exclusivos" [ref=e187] [cursor=pointer]:
            - /url: /imoveis/goiania?bairro=jardim-goias
            - img "Jardim Goiás" [ref=e188]
            - generic [ref=e190]:
              - generic [ref=e191]:
                - img [ref=e192]
                - generic [ref=e195]: Goiania
              - heading "Jardim Goiás" [level=3] [ref=e196]
              - generic [ref=e197]:
                - paragraph [ref=e198]: 67 imóveis exclusivos
                - img [ref=e200]
          - link "Setor Oeste Goiania Setor Oeste 53 imóveis exclusivos" [ref=e202] [cursor=pointer]:
            - /url: /imoveis/goiania?bairro=setor-oeste
            - img "Setor Oeste" [ref=e203]
            - generic [ref=e205]:
              - generic [ref=e206]:
                - img [ref=e207]
                - generic [ref=e210]: Goiania
              - heading "Setor Oeste" [level=3] [ref=e211]
              - generic [ref=e212]:
                - paragraph [ref=e213]: 53 imóveis exclusivos
                - img [ref=e215]
          - link "Parque Amazônia Goiania Parque Amazônia 91 imóveis exclusivos" [ref=e217] [cursor=pointer]:
            - /url: /imoveis/goiania?bairro=parque-amazonia
            - img "Parque Amazônia" [ref=e218]
            - generic [ref=e220]:
              - generic [ref=e221]:
                - img [ref=e222]
                - generic [ref=e225]: Goiania
              - heading "Parque Amazônia" [level=3] [ref=e226]
              - generic [ref=e227]:
                - paragraph [ref=e228]: 91 imóveis exclusivos
                - img [ref=e230]
      - generic [ref=e236]:
        - generic [ref=e237]:
          - heading "Oportunidade do Dia." [level=2] [ref=e238]:
            - text: Oportunidade
            - text: do Dia.
          - paragraph [ref=e239]: Uma curadoria única de imóveis com valor abaixo de mercado, selecionada por nossa inteligência de dados.
          - button "Ver Oportunidade" [ref=e240]
        - img "Oportunidade" [ref=e243]
      - generic [ref=e245]:
        - generic [ref=e246]:
          - heading "Corretores Verificados" [level=2] [ref=e247]
          - paragraph [ref=e248]: Os melhores especialistas do mercado imobiliário prontos para te atender.
        - generic [ref=e249]:
          - generic [ref=e250]:
            - generic [ref=e251]:
              - img "Broker" [ref=e253]
              - img [ref=e255]
            - generic [ref=e258]:
              - paragraph [ref=e259]: Consultor 1
              - paragraph [ref=e260]: Especialista Marista
          - generic [ref=e261]:
            - generic [ref=e262]:
              - img "Broker" [ref=e264]
              - img [ref=e266]
            - generic [ref=e269]:
              - paragraph [ref=e270]: Consultor 2
              - paragraph [ref=e271]: Especialista Marista
          - generic [ref=e272]:
            - generic [ref=e273]:
              - img "Broker" [ref=e275]
              - img [ref=e277]
            - generic [ref=e280]:
              - paragraph [ref=e281]: Consultor 3
              - paragraph [ref=e282]: Especialista Marista
          - generic [ref=e283]:
            - generic [ref=e284]:
              - img "Broker" [ref=e286]
              - img [ref=e288]
            - generic [ref=e291]:
              - paragraph [ref=e292]: Consultor 4
              - paragraph [ref=e293]: Especialista Marista
          - generic [ref=e294]:
            - generic [ref=e295]:
              - img "Broker" [ref=e297]
              - img [ref=e299]
            - generic [ref=e302]:
              - paragraph [ref=e303]: Consultor 5
              - paragraph [ref=e304]: Especialista Marista
          - generic [ref=e305]:
            - generic [ref=e306]:
              - img "Broker" [ref=e308]
              - img [ref=e310]
            - generic [ref=e313]:
              - paragraph [ref=e314]: Consultor 6
              - paragraph [ref=e315]: Especialista Marista
      - generic [ref=e318]:
        - heading "É Corretor ou Imobiliária?" [level=2] [ref=e319]:
          - text: É Corretor ou
          - text: Imobiliária?
        - paragraph [ref=e320]: Anuncie seus imóveis no portal que mais cresce em Goiânia e conecte-se com clientes qualificados.
        - generic [ref=e321]:
          - button "Anunciar Imóveis" [ref=e322]
          - button "Conhecer o CRM" [ref=e323]
    - contentinfo [ref=e324]:
      - generic [ref=e325]:
        - generic [ref=e326]:
          - generic [ref=e327]:
            - generic [ref=e328]: Habita.vc
            - paragraph [ref=e329]: O marketplace imobiliário inteligente de Goiânia. Encontre casas, apartamentos e oportunidades únicas.
          - generic [ref=e330]:
            - heading "Portal" [level=4] [ref=e331]
            - list [ref=e332]:
              - listitem [ref=e333]:
                - link "Buscar Imóveis" [ref=e334] [cursor=pointer]:
                  - /url: /imoveis
              - listitem [ref=e335]:
                - link "Lançamentos" [ref=e336] [cursor=pointer]:
                  - /url: /empreendimentos
              - listitem [ref=e337]:
                - link "Blog Imobiliário" [ref=e338] [cursor=pointer]:
                  - /url: /blog
              - listitem [ref=e339]:
                - link "Entrar / Cadastrar" [ref=e340] [cursor=pointer]:
                  - /url: /login
          - generic [ref=e341]:
            - heading "Cidades" [level=4] [ref=e342]
            - list [ref=e343]:
              - listitem [ref=e344] [cursor=pointer]: Goiânia
              - listitem [ref=e345]: Aparecida de Goiânia
              - listitem [ref=e346]: Anápolis
              - listitem [ref=e347]: Senador Canedo
        - generic [ref=e348]:
          - paragraph [ref=e349]: © 2026 Habita.vc • O Portal Imobiliário de Goiânia
          - generic [ref=e350]:
            - generic [ref=e351] [cursor=pointer]: Instagram
            - generic [ref=e352] [cursor=pointer]: LinkedIn
            - generic [ref=e353] [cursor=pointer]: YouTube
  - button "Open Next.js Dev Tools" [ref=e359] [cursor=pointer]:
    - img [ref=e360]
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