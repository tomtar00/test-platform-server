# Platforma do rozwiązywania quizów

Nasza aplikacja służy do weryfikowania wiedzy uczniów w ramach opracowanych przez nauczycieli testów. Każdy z zalogowanych użytkowników będzie posiadać przypisaną grupę charakteryzującą się odpowiednimi uprawnieniami. Informacje o użytkownikach, testach i wynikach będą przechowywane w bazie danych. Testy jednostkowe kontrolujące pomyślny przebieg operacji będą wykonywane w języku JavaScript.
## Funkcjonalności:
1. **Tworzenie konta** – rejestrujący się użytkownik podaje swoje dane: login i hasło. Po utworzeniu konta zostaje mu przypisana podstawowa grupa „Uczeń”, możliwa do podmiany przez administratora.
2. **Autentykacja** – w ramach logowania się użytkownik podaje login i hasło. Następnie aplikacja wysyła do bazy danych zapytanie odnośnie poprawności wprowadzonych informacji.
3. **Tworzenie quizów** – testy są tworzone za pomocą formularza i następnie przesyłane do bazy danych w postaci obiektu JSON.
4. **Przeglądanie quizów** – zostają pobrane wszystkie testy, spośród których użytkownik może wybrać ten, który chce wykonać. 
5. **Rozwiązywanie quizów** – test wyświetla się jako kolejne pytania z określoną liczbą możliwych odpowiedzi. Pytanie może być wielokrotnego wyboru.
6. **Podgląd wyników** – wyświetlone zostają wszystkie dostępne wyniki. Za pomocą pól tekstowych i przycisku „Szukaj” użytkownik ma możliwość filtrowania rezultatów na podstawie nazwy użytkownika lub testu.
7. **Zarządzanie bazą** – administrator ma prawo przydzielać użytkownikom grupy, zmieniać zakres uprawnień poszczególnych grup i usuwać testy.

[Dokumentacja Swagger](https://app.swaggerhub.com/apis-docs/IreneuszSob/test-platform-server-api/1.0.0)

## Diagram ERD
![Diagram ERD](images/ERD.png)

## Diagram przypadków użycia
![Diagram przypadków użycia](images/test-platform-use-cases.png)

## Podział prac
**Ireneusz Sobol**:
Opracowanie frontendu aplikacji oraz testów jednostkowych rozwiązywania quizów </br>
**Adrian Tarza**:
Przygotowanie bazy danych i jej dokumentacji oraz testów jednostkowych połączenia z serwerem </br>
**Tomasz Tarnowski**:
Opracowanie serwera Node, jego testów jednostkowych oraz dokumentacji API w Swaggerze </br>

## Architektura
Projekt opiera się na architekturze klient-serwer, która bazuje na ustaleniu, że serwer zapewnia usługi dla klientów, którzy zgłaszają do niego żądania obsługi. Zastosowania takiej architektury zapewnia lepsze zabezpieczenie danych, ponieważ znajdują się one tylko na serwerze. Jedynie serwer na prawo do odczytania i zmiany danych. Oznacza to także, że instancja serwera musi być ciągle włączoną, aby móc dostarczać dane do klientów. Duża liczba klientów próbujących otrzymać dane z jednego serwera może powodować różnego typu problemy związane z przepustowością łącza oraz technicznymi możliwościami przetworzenia żądań klientów.

## Instrukcja uruchomienia projektu
W pierwszej kolejności należy utworzyć w programie pgAdmin bazy danych o nazwach test_platform_db oraz test_platform_db_dev i uruchomić dla nich skrypt test_db_backup.sql zawarty w folderze data. Pierwsza z nich posłuży jako oficjalna baza danych łącząca się z klientem, druga - baza testowa, służąca do przeprowadzania testów jednostkowych.

W celu właściwego przeprowadzenia testów jednostkowych klienta należy uruchomić serwer w trybie testowym, za pomocą komendy ```npm run test-server```, a następnie wywołać komendę ```npm test a``` w folderze klienta. Aby uruchomić testy jednostkowe dla serwera, wystarczy użyć polecenia ```npm test a``` w jego folderze.

Aby uruchomić serwer i klienta w normalnym trybie, należy użyć komend - analogiczne ```npm start``` dla serwera oraz ```npm start``` dla aplikacji sieciowej. Po właściwym zastosowaniu obu poleceń w przeglądarce uruchomiona zostanie aplikacja React:

![Ekran startowy](images/ekran-startowy.png)

Użytkownik ma możliwość utworzenie nowego konta, jeśli poda nową nazwę użytkownika, lub zalogować się na już istniejące. Jeśli jednak poda istniejącą nazwę użytkownika i błędne hasło, aplikacja zwróci błąd:

![Błąd logowania](images/b%C5%82%C4%85d-logowania.png)

Po właściwym zalogowaniu się użytkownika aplikacja przeniesie go do strony głównej:

![Po logowaniu](images/po-logowaniu.png)

Użytkownik z uprawnieniami administratora uzyskuje najszersze uprawnienia, zobrazowane na sidebarze po lewej stronie widoku. W przypadku przynależności do innej grupy możliwości zostają okrojone:

![Student](images/student.png)
![Teacher](images/teacher.png)

Po kliknięciu w opcję tworzenia testu aplikacja wyświetli widok:

![Create test1](images/create-test1.png)

W polu tekstowym na samej górze wprowadzamy nazwę testu. Pole "Grupy" umożliwia określenie docelowych grup użytkowników, a "Przedział czasowy" - początku i końca okresu, w którym test będzie dostępny do wykonania. Przycisk "Dodaj pytanie" umożliwia dodanie nowej karty z pytaniem. W ich ramach możliwe jest dodawanie dowolnej liczby odpowiedzi, usuwania ich i określania ich poprawności.

![Create test2](images/create-test2.png)

Przycisk "Wyślij test" dodaje test do puli quizów.

Po wybraniu opcji wyszukiwania testu wyświetlony zostanie następujący widok:

![Search test](images/search-tests.png)

Za pomocą pola tekstowego na górze możliwe jest filtrowanie testów po nazwie. Każdy quiz reprezentowany jest przez jedną kartę, zawierającą jego nazwę oraz, opcjonalnie, grupy docelowe i zakres czasu, w którym test można wykonać.

Po wybraniu testu użytkownikowi ukaże się plansza z informacjami na jego temat:

![Test info](images/test-info.png)

Po przejściu dalej, zaczną pojawiać się pytania. Możliwe jest zaznaczenie więcej, niż jednej odpowiedzi:

![Question 1](images/question1.png)
![Question 2](images/question2.png)

Po zakończeniu testu ukażą się wyniki:

![Results after](images/results-after.png)

Czerwona obwódka pokazuje poprawną odpowiedź, czerwona - błędną.

Zakładka Admin zawiera trzy karty - Testy, Użytkowników oraz Uprawnienia. Poniżej przedstawiona jest pierwsza z nich:

![Admin tests](images/admin-tests.png)

Możliwe jest filtrowanie testów po nazwie. Każdy z nich reprezentowany jest przez kartę zawierającą jego nazwę, id, oraz dwa przyciski - czerwony służący do usunięcia testu, i niebieski, który służy do przedstawienia danych:

![Test info](images/test-info2.png)

Karta "Użytkownicy":

![Admin users](images/admin-users.png)

Podobnie, jak w przypadku testów, możliwe jest filtrowanie po nazwie, a niebieski przycisk umożliwia wyświetlenie informacji o użytkowniku:

![Admin users info](images/admin-users-info.png)

Po wybraniu karty "Uprawnienia" wyświetlony zostaje następujący widok:

![Admin privilleges](images/admin-privilleges.png)

Grupy można filtrować. Klikając w przyciski tabeli można przyznawać i odbierać dane uprawnienie, a wciśnięcie żółtego przycisku w prawym dolnym rogu zapisuje wprowadzone zmiany.

Ostatnią z zakładek jest karta statystyk. Po jej wybraniu pojawia się widok:

![Statistic table](images/stat-table.png)

W tabeli przedstawione są wszystkie podejścia do testów z uwzględnieniem ich nazwy, użytkownika, stosunku punktów zdobytych do możliwych oraz wyniku procentowego. Możliwe jest filtrowanie podejść po nazwie użytkownika i/lub testu.

W zakładce "Wykres" pojawiają są trzy grupy wykresów:

![Statistic chart 1](images/stat-chart1.png)
![Statistic chart 2](images/stat-chart2.png)

Są to odpowiednio średnie wyniki dla użytkowników, średnie wyniki dla testów i ilość wyników powyżej 50% dla każdego użytkownika.

Ostatnia zakładka to podejścia:

![Statistic attempts](images/stat-attempts.png)

Pokazuje ona liczbę podejść z uwzględnieniem użytkownika i testu. Możliwe jest filtrowanie tych danych po loginie i nazwie quizu.

W lewym dolnym rogu, na dole Sidebara, znajduje się rozwijane menu użytkownika, które pozwala wylogować się z usługi

![Logout](images/logout.png)