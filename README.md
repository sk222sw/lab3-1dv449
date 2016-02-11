# lab3-1dv449
laboration 3 - mashup och api:er

**Vad finns det för krav du måste anpassa dig efter i de olika API:erna?**

SR skriver "Materialet som tillhandahålls via API får inte användas på ett sådant sätt att det skulle kunna skada Sveriges Radios oberoende eller trovärdighet." Annars finns inga begränsningar. 

**Hur och hur länga cachar du ditt data för att slippa anropa API:erna i onödan?**

Jag vill inte cacha för länge, eftersom datat i API:t uppdateras kontinuerligt och för lång cachning kan ge konsekvenser för användaren. Till exempel om man använder appen när man planerar en sträcka som man ska köra - om datat cachas för länge så finns det möjlighet att något hunnit hända från senaste cachningen till när användaren planerar sin rutt. Därför har jag valt att cacha datat i en minut, då jag anser att en förfrågan i minuten inte bör påverka API:erna särskilt mycket.

**Vad finns det för risker kring säkerhet och stabilitet i din applikation?**

Applikationen är helt beroende av API:erna jag använder mig av. Skulle det hamna skadlig kod i ett API så finns det risk att min app kan skadas. Om ett API:ets server ligger nere så kommer min applikation att sluta fungera. En uppdatering av användningen av ett API skulle även kunna få min app att sluta fungera. 

**Hur har du tänkt kring säkerheten i din applikation?**

Såvida det inte finns några säkerhetsbrister i API:erna så ser jag inga säkerhersbrister i min app. Inga inputfält används. Det går att göra posts till servern men då skickas bara ikryssade checkboxes med.

**Hur har du tänkt kring optimeringen i din applikation?**

Jag länkar in CSS i *head* och skript sist i *body*. Det är en liten enkel applikation och jag har därför inte lagt tid på några större optimeringar, men för lite bättre optimering skulle jag kunna minifiera skript och css.


## Komplettering 

**HTTP/2**

HTTP var från början väldigt simpelt, vilket hjälpte det att växa och användas i större utsträckning. Under tiden som det blev större och användes mer så utvecklades det nyare versioner, från HTTP 0.9 till HTTP 1.1. Med åren har webben och webbapplikationer utvecklats väldigt snabbt, och dagens appar har sprungit ifrån HTTP 1.1, vilket skapat begränsningar. Tanken med HTTP/2 är att få HTTP-protokollet att hinna ifatt utvecklingen. Övergången från 1.1 till 2 ska gå så transparent som möjligt så att inga 1.1-system kraschar.

Huvudfokus ligger på prestanda. Data skickas inte längre via ASCII-protokoll utan med binära protokoll. Detta ger bättre prestanda och och minimerar antalet fel som kan ske med ASCII, men förutsätter också att server och webbläsare är rustade för det.

Andra stora förändringar är att man med “multiplexing” kan skicka flera förfrågningar samtidigt på en och samma anslutning, headers komprimeras och med “server push” kan servern skicka data till klienten utan att en request görs.

**Service workers**

Service workers är ett nytt api som är under utveckling med fullt stöd endast i Chrome och Firefox. Det fungerar som en proxy mellan webbappar och webbläsare. Genom att cacha data kan man på ett smidigt sätt använda olika filer beroende på olika situationer. 

I dagsläget används det främst för att implementera offline-lösningar; tappar användaren uppkoppling så laddas cachad data in och möjliggör att man kan fortsätta använda appen i offline-läge tills man blir uppkopplad igen. Med hjälp av olika lösningar för lagring på användarens dator eller i webbläsaren kan man ha en databas för offline-läge hos klienten, som automatiskt synkar med en “vanlig” databas på en server när möjlighet ges.

Service workers är ett steg i utecklingen mot att webbappar ska fungera mer som program eller appar som man installerar på en dator.
