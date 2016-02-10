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
