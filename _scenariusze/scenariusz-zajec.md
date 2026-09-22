# WDP 2026 — Od terminala dyżurnego do własnej maszyny

Samodzielny scenariusz dla prowadzącego: 18 sesji podstaw C i pięć ćwiczeń CHIP-8. Tekst po polsku; nazwy w nowym kodzie i komentarze w kodzie po angielsku. Karty zawierają odpowiedzi, dlatego nie są gotowym publicznym zestawem dla studentów.

## Historia, która nie wymaga innych przedmiotów

„W fikcyjnej bazie szkoleniowej tworzycie prosty program pomocniczy dla dyżurnego. Początkowo liczy wyposażenie. Później odtwarza zadaną sekwencję poleceń: wczytaj wartość, zmień ją, pokaż wynik. W końcu potrafi uruchomić program zapisany w pliku”.

To nauka programowania na syntetycznych liczbach, nie sterowanie rzeczywistym urządzeniem. Nie potrzebujemy serwera, bazy danych, elektroniki ani znajomości architektury procesorów. Po podstawach budujemy osobny emulator CHIP-8, wykorzystując poznane mechanizmy C. Nasza wcześniejsza maszyna nie jest zgodna z CHIP-8.

**Ważny kontrakt:** wartości takie jak 12 sztuk i 3 wydane sztuki są danymi do obliczeń. Maszyna dydaktyczna wykonuje instrukcje arytmetyczne, a nie egzekwuje wszystkie reguły prawdziwego magazynu. Nie obiecujemy, że ujemny wynik zawsze oznacza błąd samej maszyny.

## Organizacja i materiały startowe

Proponowany rytm sesji 45-minutowej: 5 min dwa pytania z poprzednich zajęć, 5 min sytuacja i przewidywanie, 8 min pokaz pojęcia, 17 min zadanie A, 7 min zadanie B, 3 min indywidualne wyjaśnienie. Na sesji 1 diagnoza bez punktów. Istniejące quizy od sesji 2 pełnią rolę powtórki; nie dopisujemy tutaj nowych pytań do backendu.

**Wariant planu do uzgodnienia z rozkładem grupy:** 18 × 45 min podstaw, 5 × 45 min CHIP-8, 1 × 45 min bufor/odbiór daje 24 godziny dydaktyczne. To wariant ambitny: wymaga szkieletów programu i ograniczenia zadań dodatkowych. Niektóre grupy potrzebują więcej czasu na wskaźniki, parser i emulator; wtedy nie należy obiecywać ukończenia gry w tym samym limicie.

Przed każdą sesją prowadzący przygotowuje kompilowalny punkt startowy z poprzedniego etapu oraz oczekiwany wynik. Student nieobecny wcześniej rozpoczyna z tego samego punktu. Ten dokument opisuje karty i odbiór, ale nie zawiera jeszcze zestawu takich plików C.

Minimalny wspólny zestaw prób: poprawna krótka sekwencja, nieznana instrukcja, pusty program; od wprowadzenia danego mechanizmu także zły indeks rejestru, zły adres skoku, pełny/pusty stos i błąd odczytu pliku. Nie wymagaj obsługi pojęcia, którego grupa jeszcze nie poznała. Programy z błędnymi indeksami omawiaj najpierw jako analizę, nie jako demonstrację przewidywalnego wyniku niezdefiniowanego zachowania.

Pary zamieniają role osoby piszącej i sprawdzającej przy zadaniu B. Obie osoby zapisują własną prognozę przed uruchomieniem.

## Sesja 1 — Terminal po raz pierwszy odpowiada

Materiał: [Pierwszy program](../podstawy_programowania/sesje/01_pierwszy_program.qmd).

**Sytuacja:** dyżurny chce wiedzieć, czy uruchomił właściwy program. **A:** skompiluj program wypisujący nazwę fikcyjnego stanowiska i komunikat gotowości. **B:** zmień tekst i sprawdź różnicę między uruchomieniem starego pliku a ponowną kompilacją.

**Zmiana:** celowo brak średnika. **Odbiór:** student znajduje komunikat kompilatora i wskazuje etap, na którym wykonanie zostało zatrzymane. Na pierwszej sesji nie wymagamy wczytywania tekstu ani walidacji wejścia.

## Sesja 2 — Ile kompletów można przygotować?

Materiał: [Zmienne i kalkulator](../podstawy_programowania/sesje/02_zmienne_kalkulator.qmd).

**Sytuacja:** są 23 baterie, komplet wymaga 4. **A:** oblicz liczbę pełnych kompletów i pozostałych baterii: 5 i 3. **B:** porównaj dzielenie całkowite z wynikiem rzeczywistym 5,75.

**Zmiana:** liczba baterii zmienia się na 24. **Odbiór:** wyniki 6 i 0 bez przebudowy wzoru; student wyjaśnia typy. Do czasu wprowadzenia warunków dzielnik jest dodatnią stałą, nie dowolną liczbą od użytkownika.

## Sesja 3 — Nierozpoznane polecenie

Materiał: [Warunki i dispatcher](../podstawy_programowania/sesje/03_warunki_dispatcher.qmd).

**Sytuacja:** operator wybiera działanie kalkulatora. **A:** rozpoznaj dodawanie i odejmowanie przez `switch`. **B:** dodaj dzielenie z odrzuceniem dzielnika zero oraz komunikat dla nieznanej operacji.

**Zmiana:** operator wybiera `?`. **Odbiór:** brak przypadkowego wykonania poprzedniego działania, brak dzielenia przez zero. Student wyjaśnia różnicę między przypisaniem i porównaniem.

## Sesja 4 — Cała zmiana dyżurna

Materiał: [Pętle i REPL](../podstawy_programowania/sesje/04_petle_repl.qmd).

**Sytuacja:** kalkulator kończy pracę po pierwszym obliczeniu. **A:** wykonuj kolejne polecenia do wpisania `q`. **B:** policz poprawnie wykonane operacje, pomijając wyjście i odrzucone polecenia.

**Zmiana:** wejście to dodawanie, `?`, odejmowanie, `q`. **Odbiór:** licznik wynosi 2, program kończy się po `q`. Na przykładzie pętli bez zmiany warunku student rozpoznaje ryzyko nieskończonego wykonania.

## Sesja 5 — Lista poleceń zamiast ręcznego klikania

Materiał: [Tablice i pierwsza maszyna](../podstawy_programowania/sesje/05_tablice_pierwsza_maszyna.qmd).

**Sytuacja:** codziennie wykonujemy tę samą serię obliczeń. **A:** zakoduj w tablicy polecenia odpowiadające `LOAD 12`, `SUB 3`, `PRINT`. Wynik: 9. Użyj numerów operacji zgodnych z materiałem sesji. **B:** zastąp dane tak, by policzyć 20−6; wynik 14.

**Zmiana:** prowadzący pokazuje tablicę z nieparzystą liczbą elementów. **Odbiór:** student wskazuje brak argumentu ostatniej instrukcji, zanim program odczyta element poza tablicą. Wyjaśnia różnicę między kodem interpretera a danymi programu.

## Sesja 6 — Jedno miejsce wykonywania instrukcji

Materiał: [Funkcje](../podstawy_programowania/sesje/06_funkcje.qmd).

**Sytuacja:** dwa fragmenty programu inaczej liczą tę samą operację. **A:** wydziel wykonanie instrukcji do funkcji zwracającej nową wartość akumulatora. **B:** sprawdź tę samą sekwencję przed i po wydzieleniu.

**Zmiana:** usuń przypisanie zwróconego wyniku do akumulatora. **Odbiór:** student przewiduje brak aktualizacji zmiennej wywołującej i wyjaśnia przekazywanie przez wartość. Nie wprowadzaj jeszcze wskaźników jako warunku rozwiązania.

## Sesja 7 — Polecenie ma własną strukturę

Materiał: [Struktury](../podstawy_programowania/sesje/07_struktury.qmd).

**Sytuacja:** w płaskiej tablicy ktoś pomylił argument z kodem operacji. **A:** zastąp parę liczb strukturą instrukcji. **B:** wypisz numer operacji i argument każdej instrukcji, a potem wykonaj program.

**Zmiana:** zmienia się liczba instrukcji. **Odbiór:** obliczenie długości tablicy struktur nie zawiera starego dzielenia przez 2. Wynik programu z poprzedniej sesji nadal wynosi 9.

## Sesja 8 — Co oznacza liczba 4?

Materiał: [Enumy](../podstawy_programowania/sesje/08_enumy.qmd).

**Sytuacja:** recenzent nie rozumie tablicy samych liczb. **A:** nazwij kody przez `enum` i użyj nazw w `switch`. **B:** dodaj jedną operację według materiału i pokaż jej działanie na małych liczbach.

**Zmiana:** pojawia się liczba nieprzypisana do obsługiwanej operacji. **Odbiór:** komunikat w gałęzi domyślnej; student wie, że nazwanie wartości nie zastępuje kontroli wejścia. Format pliku i stabilne kody omawiamy dopiero przy sesji 17.

## Sesja 9 — Dwie wartości trzeba zachować

Materiał: [Rejestry](../podstawy_programowania/sesje/09_rejestry.qmd).

**Sytuacja:** trzeba zachować oba wyniki cząstkowe do późniejszego raportu. **A:** oblicz w dwóch rejestrach 12−3 oraz 20−6; wyniki 9 i 14. **B:** dodaj wartość drugiego rejestru do pierwszego, zachowując drugi; wyniki 23 i 14.

**Zmiana:** operator podaje indeks spoza tablicy rejestrów. **Odbiór:** odrzucenie instrukcji przed dostępem do pamięci. Uzasadnieniem wielu rejestrów jest zachowanie wielu wartości, nie twierdzenie, że każda prosta formuła wymaga kilku akumulatorów.

## Sesja 10 — Funkcja naprawdę zmienia stan

Materiał: [Wskaźniki](../podstawy_programowania/sesje/10_wskazniki_podstawy.qmd).

**Sytuacja:** funkcja zwiększa lokalną kopię, lecz dyżurny nadal widzi starą wartość. **A:** porównaj przekazanie liczby z przekazaniem jej adresu. **B:** napisz zamianę wartości dwóch zmiennych przez wskaźniki.

**Zmiana:** obydwa argumenty zamiany wskazują tę samą zmienną. **Odbiór:** wartość nie zmienia się; student rozróżnia adres od zawartości. Używamy wyłącznie poprawnych wskaźników do istniejących obiektów.

## Sesja 11 — Dwie niezależne maszyny

Materiał: [Wskaźniki do struktur](../podstawy_programowania/sesje/11_wskazniki_do_struktur.qmd).

**Sytuacja:** dwa stanowiska mają osobne wyniki. **A:** umieść rejestry w strukturze stanu i modyfikuj ją przez wskaźnik. **B:** utwórz dwa stany, wykonaj instrukcję tylko na jednym.

**Zmiana:** zerujemy drugi stan. **Odbiór:** pierwszy zachowuje swoje wartości; nie ma przypadkowego wspólnego globalnego rejestru. Student wyjaśnia `.` i `->` na swoim kodzie.

## Sesja 12 — Program większy niż przygotowana tablica

Materiał: [Pamięć dynamiczna](../podstawy_programowania/sesje/12_pamiec_dynamiczna.qmd).

**Sytuacja:** długość listy instrukcji znamy dopiero podczas działania. **A:** zaalokuj miejsce na zadane dodatnie N, sprawdź wynik, wykonaj program i zwolnij pamięć. **B:** powiększ bufor przez `realloc` z tymczasowym wskaźnikiem.

**Zmiana:** prowadzący omawia gałąź nieudanej alokacji; nie próbujemy wymuszać jej wyczerpaniem pamięci komputera. **Odbiór:** stary wskaźnik i pojemność pozostają ważne po nieudanym powiększeniu; brak podwójnego zwalniania. Wielkie N i przepełnienie obliczenia rozmiaru to rozszerzenie omawiane przez prowadzącego.

## Sesja 13 — Nie zawsze następna instrukcja

Materiał: [Licznik instrukcji](../podstawy_programowania/sesje/13_licznik_instrukcji.qmd).

**Sytuacja:** program ma pominąć fragment sekwencji. **A:** wykonuj instrukcje według `pc`, dodaj skok do istniejącego indeksu. **B:** ręcznie wypisz ślad `pc` dla programu pięcioinstrukcyjnego z jednym skokiem.

**Zmiana:** skok prowadzi do siebie. **Odbiór:** student rozpoznaje nieskończone wykonanie; demonstrator ma limit kroków. Ustalamy jawnie: `pc == instruction_count` kończy program, ujemne i większe adresy są błędem. Nie dowodzimy, że pętla `for` „nie umie skakać”.

## Sesja 14 — Reakcja na wynik porównania

Materiał: [Flagi i skoki warunkowe](../podstawy_programowania/sesje/14_flagi_skoki_warunkowe.qmd).

**Sytuacja:** sekwencja powinna powtarzać się tylko określoną liczbę razy. **A:** porównaj rejestr z zerem i zapisz wynik w fladze. **B:** zbuduj odliczanie 3, 2, 1, zakończenie przy 0.

**Zmiana:** wartość początkowa to 0. **Odbiór:** sprawdzenie warunku przed odejmowaniem zapobiega zejściu do −1 i dalszemu odliczaniu. To model naszej maszyny; CHIP-8 będzie używał także instrukcji łączących porównanie i pominięcie kolejnej instrukcji, bez tej flagi zero.

## Sesja 15 — Ostatnio odłożone, najpierw odzyskane

Materiał: [Stos](../podstawy_programowania/sesje/15_stos.qmd).

**Sytuacja:** trzeba na chwilę zachować wartości. **A:** po `push(9)`, `push(14)` przewidź dwa wyniki `pop`: 14, 9. **B:** obsłuż pełny i pusty stos bez dostępu poza tablicę.

**Zmiana:** próba zdjęcia z pustego stosu. **Odbiór:** jawny wynik błędu, nie wartość 0 udająca prawidłowy odczyt; `sp` nie wychodzi poza ustalony zakres. Skojarzenie z odkładaniem przedmiotów ma wyjaśnić LIFO, nie modelować kolejkę zgłoszeń.

## Sesja 16 — Wspólny fragment programu

Materiał: [CALL i RET](../podstawy_programowania/sesje/16_call_ret.qmd).

**Sytuacja:** dwa miejsca programu wykonują tę samą krótką procedurę. **A:** dodaj wywołanie zapisujące adres powrotu. **B:** prześledź główny program → procedura A → procedura B → A → program główny.

**Zmiana:** `RET` pojawia się bez wcześniejszego wywołania. **Odbiór:** kontrolowany błąd pustego stosu. Student pokazuje, dlaczego powrót prowadzi za instrukcję CALL. Zagnieżdżone wywołania nie są automatycznie rekurencją.

## Sesja 17 — Ta sama maszyna, inny plik

Materiał: [Pliki](../podstawy_programowania/sesje/17_pliki.qmd).

**Sytuacja:** nową sekwencję trzeba dostarczyć bez rekompilacji interpretera. **A:** wczytaj program w liczbowym formacie z sesji. **B:** zamień plik danych i uzyskaj inny wynik z tego samego pliku wykonywalnego.

**Zmiana:** plik nie istnieje albo ostatni wiersz jest niepełny. **Odbiór:** program odróżnia błąd otwarcia, poprawny koniec danych i błąd formatu. Nie wykonuje częściowo wczytanego programu jako kompletnego. Obowiązuje tabela kodów z sesji 17 i trzy pola `kod rejestr wartosc`. Dla `ADD_REG` pole `wartosc` jest indeksem źródłowego rejestru, tak jak w sesji 9. Próba `1 0 9`, `1 1 14`, `6 0 1`, `3 0 0`, `3 1 0` daje 23 i 14.

## Sesja 18 — Czytelne polecenia

Materiał: [Stringi i parser](../podstawy_programowania/sesje/18_stringi_parser.qmd).

**Sytuacja:** operator chce czytać `LOAD R0 12`, a nie zgadywać znaczenie liczb. **A:** rozpoznaj nazwę operacji i zbuduj reprezentację instrukcji. **B:** odrzuć brak argumentu, nieznaną nazwę i niepoprawny numer rejestru, podając numer wiersza.

**Zmiana:** wejście `LOAD R99 abc`. **Odbiór:** nie ma cichego potraktowania błędnej liczby jako zera ani dostępu poza tablicę. Prowadzący daje szkielet sprawdzania konwersji liczby, jeśli grupa jeszcze go nie zna. Tekst → instrukcje to parser/asembler dydaktyczny; disassembler wykonuje odwrotny kierunek.

## Finał CHIP-8 — nowy format, znane narzędzia

Nie przedstawiaj emulatora jako kosmetycznej zmiany nazw poprzedniej maszyny. Trzeba od nowa wyjaśnić bajty instrukcji, pamięć, 16 rejestrów i sposób dekodowania. Wcześniejsze sesje dostarczyły narzędzi C, nie zgodnego zestawu instrukcji. Wszystkie ćwiczenia poniżej należą do WDP i nie wymagają osobnego kursu architektury.

### Ćwiczenie 1 — Odczytaj dwubajtową instrukcję

Materiał: [Szkielet VM](../podstawy_programowania/cwiczenia_chip8/01_szkielet_vm.qmd).

**A:** z bajtów `0x60, 0x0A` odtwórz `0x600A` i wykonaj ustawienie V0 na 10. **B:** wypisz ślad `pc` krótkiego programu. **Zmiana:** za duży ROM. **Odbiór:** odrzucenie przed zapisem poza pamięć; kontrola zakresu pobrania instrukcji. Prowadzący dostarcza loader i pokazuje operacje bitowe przed samodzielnym dekodowaniem.

### Ćwiczenie 2 — Arytmetyka ma granice

Materiał: [Arytmetyka, skoki i stos](../podstawy_programowania/cwiczenia_chip8/02_arytmetyka_skoki.qmd).

**A:** sprawdź dodawanie 250 + 10 w rejestrze 8-bitowym instrukcją ustawiającą przeniesienie: wynik 4, flaga 1. **B:** prześledź CALL/RET oraz warunkowe pominięcie instrukcji. **Zmiana:** odejmowanie równych liczb — brak pożyczki. **Odbiór:** wynik i flagi sprawdzane oddzielnie; puste/pełne stosy obsłużone. W 45 minut studenci uzupełniają wybrane instrukcje w szkielecie, nie piszą całego dekodera od zera.

### Ćwiczenie 3 — Pierwszy własny obraz

Materiał: [Wyświetlacz](../podstawy_programowania/cwiczenia_chip8/03_wyswietlacz.qmd).

**A:** narysuj dostarczony sprite. **B:** narysuj go ponownie w tym samym miejscu. **Zmiana:** częściowe przecięcie z już ustawionymi pikselami. **Odbiór:** przy XOR dwukrotne narysowanie na pustym tle przywraca puste tło, a drugie rysowanie zgłasza kolizję. Prowadzący określa wariant zachowania na krawędzi; nie mieszamy różnych wariantów CHIP-8 w jednym teście.

### Ćwiczenie 4 — Program czeka, czas nadal płynie

Materiał: [Timery i klawiatura](../podstawy_programowania/cwiczenia_chip8/04_timery_klawiatura.qmd).

**A:** pokaż zmianę timera niezależnie od liczby instrukcji. **B:** wprowadź klawisz w dostarczonej obsłudze wejścia. **Zmiana:** szybsze wykonywanie instrukcji. **Odbiór:** student wie, że licznik czasu nie może po prostu maleć po każdej instrukcji. Terminal daje uproszczony model klawiatury; sprawdzamy jego ograniczenia, zamiast obiecywać wierne odwzorowanie przytrzymania klawisza. Konfigurację terminala przygotowuje prowadzący.

### Ćwiczenie 5 — Odbiór emulatora

Materiał: [Uruchomienie programu](../podstawy_programowania/cwiczenia_chip8/05_uruchomienie_gry.qmd).

**A:** uruchom wcześniej sprawdzony przez prowadzącego mały ROM testowy zgodny z zaimplementowanym podzbiorem. **B:** uruchom wybraną demonstrację/gierkę, jeśli obsługiwane instrukcje i wariant zachowania na to pozwalają. **Zmiana:** ROM używa brakującej instrukcji. **Odbiór:** student identyfikuje brak po komunikacie i dekodowaniu, zamiast zgadywać. Nie zakładamy działania dowolnej gry po czterech ćwiczeniach; brakujące instrukcje są jawnym zakresem dalszej pracy.

## Ocena i plan awaryjny

Propozycja formatywna: 0–2 pkt poprawny wynik podstawowy, 0–1 przypadek brzegowy, 0–1 indywidualne wyjaśnienie śladu wykonania. Nie jest to zmiana formalnych zasad zaliczenia ani klucza quizów.

Jeżeli grupa nie zdąży: kończymy minimalne zadanie A, zadanie B omawiamy wspólnie, a kolejną sesję zaczynamy od przygotowanego punktu wznowienia. Sesję buforową przeznaczamy na największą faktyczną trudność. Finał można ograniczyć do własnej maszyny z parserem i pokazu CHIP-8, jeśli nie ma czasu na samodzielny emulator. Ocenie podlega opanowanie C, nie liczba uruchomionych gier.

Scenariusz pokrywa aktualne materiały w C. Jeśli program przedmiotu wymaga także C++, należy zaplanować osobny blok i wskazać, z czego czasowo rezygnujemy; sama kompilacja kodu C kompilatorem C++ nie realizuje takiego celu.
