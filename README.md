# MUZEUM DO/NA FALI

# instalacja
Prototyp szkoleniowo-szkieletowy w wersji nieaktualnej. Służy wypróbowaniu sailsjs jako workera w rabbitmq i innych eksperymentów przedwdrożeniowych. 
Sails jest w katalogu 'rabbit/srrm'. Tam należy wykonać 'npm install'.
Ponadto należy zainstalować z domyślnymi ustawieniami rabbitmq 
i potem 'rabbitmq-plugins enable rabbitmq_management' itd.:
- (https://www.rabbitmq.com/management.html):

# działania
1. 'nodejs sender.js' wysyła ciurkiem 1000 wiadomości (losowy string) do RMQ.
2. sailjs konsumuje wiadomości i acknowledżuje w odstępach 10ms.     
3. podgląd stanu kolejki './rabbitmqadmin list queues'.
4. podgląd ostatnich wpisów kolejki './rabbitmqadmin get queue=HeartBeat requeue=true count=100'.
5. do 3. i 4. jest też fajne GUI: 'http://localhost:15672/' (guest/guest przy domyślnej instalacji)

# efekty
Konsola sails. Logowanie pierwszej i ostatniej wiadomości. Coś tam jeszcze nie gra. Różnie się zachowuje zależnie od liczby wiadomości (10 czy np. 10000) z send.js.

Ponadto: 
- wywalony całkiem grunt/gulp w sails (w .sailrc), 
- dołożony i wypróbowany PermissionCheckService i propozycja uprawnień na 10-ciu(?) level-ach przez policies, 
- testowanie banalnego one-page-app przy pomocy layout = null,
- testowanie gc w app.js na końcu. W takim przypadku odpalanie sails przez 'nodejs --expose-gc app.js',
- dołożone logowanie kwerend mysql-a z waterline - ale to wymaga zmiany w module więc nie ma w git. Potrzebne czasami. Jak-by-co to wiem gdzie.
