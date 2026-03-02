### Feedback voor reperatie:
Reparatieafspraken, laat in week 6 (na de eerste terugkomdag) zien: 

3.1.2 & 3.4.3: Werk komende periode aan een component waar alles in samenkomt. API calls, semantische a11y HTML code, PE en responsive CSS layout én client side interactie via onmount. Probeer sveltekit (of Astro) trucjes toe te passen: voor Sveltekit is dit bijv. (two-way) binding, use:enhance etc..

## 3.1.2 — Principes, standaarden en best-practices

### Progressive Enhancement
Het form heeft een method="POST" en een action="?/search" dit betekent dat het form werkt zonder JavaScript. Met JavaScript wordt use:enhance toegevoegd wat de submit onderschept en zorgt dat de pagina niet herlaad. Alles werkt dus zonder js alleen maakt het het wel beter.

### Semantische HTML
De html is semantisch en de html elementen zijn gekozen op basis van hun functie:

`<main>` de hoofdinhoud van de pagina

`<nav>` de favorieten navigatie

`<section>` secties voor huidig weer en forecast

`<header>` de header van de weersectie met stadsnaam en ster

`<dl>` `<dt>` `<dd>` voor de weerdetails (luchtvochtigheid, windsnelheid)

`<ol>` de forecast is een geordende lijst van dagen

### Toegankelijkheid (a11y)
Het input veld heeft een gekoppelde <label> via for/id visueel verborgen maar aanwezig voor screenreaders

### Responsive CSS
https://github.com/Ties7/weather-app/blob/048202ed0eb721df433457a8929e6b09657db763/src/routes/%2Bpage.svelte#L410-L422

## 3.4.3 - Complexe frontend code, tools en frameworks

### SvelteKit form actions
De API calls gebeuren server-side via een SvelteKit form action. De server ontvangt de stadsnaam, doet twee API calls naar openweathermap, verwerkt de data, en stuurt het resultaat terug.

https://github.com/Ties7/weather-app/blob/048202ed0eb721df433457a8929e6b09657db763/src/routes/%2Bpage.server.js#L4-L7

### Two way binding
Het input veld gebruikt bind:value voor two way binding. Als de gebruiker typt updatet selectedCity. Als selectedCity verandert in de code bijvoorbeeld bij het klikken op een favoriet updatet het input veld automatisch mee.

https://github.com/Ties7/weather-app/blob/048202ed0eb721df433457a8929e6b09657db763/src/routes/%2Bpage.svelte#L58

https://github.com/Ties7/weather-app/blob/048202ed0eb721df433457a8929e6b09657db763/src/routes/%2Bpage.svelte#L72

### Svelte stores, writable en derived
De favorieten worden bijgehouden in een writable store buiten het component zodat die data beschikbaar is voor meerdere bestanden. Daarnaast zijn er twee derived stores die automatisch updaten met de favorieten store:

https://github.com/Ties7/weather-app/blob/048202ed0eb721df433457a8929e6b09657db763/src/lib/favorites.js#L3-L6

### onMount voor clientside interactie
SvelteKit rendert pagina's eerst serverside. localStorage bestaat alleen in de browser. OnMount zorgt dat de favorieten alleen worden geladen als het component in de browser draait:

https://github.com/Ties7/weather-app/blob/048202ed0eb721df433457a8929e6b09657db763/src/routes/%2Bpage.svelte#L23-L25

### Reactive statements
De weerdata wordt bijgehouden via reactive statements. Zodra form een nieuw resultaat krijgt van de server updaten weather, forecast en error automatisch:

https://github.com/Ties7/weather-app/blob/048202ed0eb721df433457a8929e6b09657db763/src/routes/%2Bpage.svelte#L27-L29

### tick() voor DOM synchronisatie
Bij het klikken op één van de favorieten wordt selectedCity aangepast en het form met die favoriet gesubmit. tick() zorgt dat Svelte de DOM heeft bijgewerkt voordat het form wordt gesubmit anders stuurt het form een lege waarde:

https://github.com/Ties7/weather-app/blob/048202ed0eb721df433457a8929e6b09657db763/src/routes/%2Bpage.svelte#L31-L35

### Async/await en fetch
Beide API calls gebruiken async/await. Foutafhandeling gebeurt via fail() van SvelteKit voor verwachte fouten (stad niet gevonden, leeg veld) en een try/catch voor fouten:

https://github.com/Ties7/weather-app/blob/048202ed0eb721df433457a8929e6b09657db763/src/routes/%2Bpage.server.js#L13-L21
https://github.com/Ties7/weather-app/blob/048202ed0eb721df433457a8929e6b09657db763/src/routes/%2Bpage.server.js#L47-L49

### Array verwerking met .map()
De forecast data van OpenWeatherMap heeft 40 meetpunten (één per 3 uur). .map() selecteert één meting per dag en zet die om naar een bruikbaar object:

https://github.com/Ties7/weather-app/blob/048202ed0eb721df433457a8929e6b09657db763/src/routes/%2Bpage.server.js#L28-L34

