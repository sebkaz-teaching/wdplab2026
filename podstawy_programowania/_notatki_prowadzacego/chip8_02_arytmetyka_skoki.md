# Notatki prowadzącego — Ćwiczenie 2: Arytmetyka, skoki, stos

## Punkty do omówienia

1. **Stos jako osobna tablica** — to jest ćwiczenie, w którym warto explicite powiedzieć:
   "zapomnijcie na chwilę o stosie ze swojego programu w C (adres powrotu, zmienne
   lokalne) — to jest **inny, prostszy** stos, tylko 16 liczb w tablicy." Rysunek na
   tablicy: `stack[16]` jako pionowa kolumna, `sp` jako strzałka wskazująca pierwsze
   wolne miejsce.

2. **"Skip" jako jedyny warunek** — dobry moment na żywe demo: napisać na tablicy `if (x == 5) { foo(); }` po polsku, a obok pokazać "jak by to wyglądało instrukcjami CHIP-8" (SNE + JP omijający wywołanie). Studenci lepiej łapią przez kontrast z czymś znajomym (jeszcze nie mieli `if` w C na tym etapie kursu — to specjalnie wcześniej niż `if` w sesjach fundamentów, użyć tego jako zapowiedzi "zobaczycie to niedługo w C, i będzie dużo wygodniejsze").

3. **VF jako "brudzony" rejestr** — podkreślić mocno: "jeśli chcecie zapisać coś w V[15] między dwoma operacjami arytmetycznymi, stracicie to" — to jest źródło błędów, które ujawni się dopiero w ćwiczeniu 3 (kolizje).

4. **0xFF jako -1** — połączyć wprost z wykładem o U2, jeśli już był. Jeśli NIE był jeszcze na wykładzie architektury w tym momencie semestru — zasygnalizować, że to "zapowiedź", i nie drążyć tematu matematycznie, tylko dać im zapamiętać regułę operacyjnie ("dodanie 0xFF to odjęcie 1, bo tak działa arytmetyka modulo 256 na uint8_t").

## Typowe błędy

- **Kolejność w SUB**: liczą `VF` PO odjęciu zamiast PRZED — wynik zawsze wychodzi zły, bo porównują już zmienioną wartość. To dosłownie ta sama klasa błędu co w ćwiczeniu 1 (kolejność operacji), warto to nazwać głośno: "to drugi raz w tym kursie, gdy kolejność linijek zmienia wynik — zapamiętajcie ten wzorzec."
- **Mylą `SE`/`SNE` kierunkiem** — wstawiają skip gdy równe zamiast gdy różne (albo odwrotnie) i pętla testowa się nie kończy (nieskończona) lub kończy natychmiast.
- **`CALL`/`RET` bez inkrementacji/dekrementacji `sp`** — zapisują pod ten sam adres stosu wielokrotnie, albo czytają z niezainicjalizowanego miejsca.
- **Zapominają `srand()`** — `RND` daje tę samą "losową" wartość przy każdym uruchomieniu, student myśli że coś jest zepsute, a tylko brakuje jednej linijki w `main`.

## Przewidywane pytania

**"Czemu nie ma normalnego `if` w CHIP-8?"**
Bo to bardzo prosty procesor z lat 70. — "skip następnej instrukcji" da się zrobić jedną, tanią operacją sprzętową (porównaj i ewentualnie zwiększ PC podwójnie). Pełny `if-else` wymagałby więcej sprzętu do dekodowania. Nowoczesne procesory (x86, ARM) MAJĄ pełne instrukcje skoku warunkowego — CHIP-8 to celowo minimalistyczny wyjątek, dobry do nauki właśnie dlatego, że pokazuje "podłogę" tego, z czego można zbudować warunek.

**"Dlaczego stos ma dokładnie 16 poziomów, nie więcej?"**
Ograniczenie historyczne oryginalnej implementacji — nie ma głębszego uzasadnienia technicznego poza "tyle wystarczało ówczesnym grom." Dobra okazja do zapytania z powrotem: "co się stanie w waszym kodzie C, jeśli zagnieździcie 17 wywołań `CALL`?" (odpowiedź: `sp` wyjdzie poza tablicę, undefined behavior — nic ich nie ochroni, bo sami piszecie ten mechanizm).

## Podział czasowy (45 min)

- 5 min — przypomnienie z ćwiczenia 1 + wprowadzenie stosu (rysunek na tablicy)
- 10 min — RET/CALL + rodzina "skip" (z żywym demo if→skip)
- 20 min — kodowanie (ALU 8XY*, to najdłuższa część, dużo case'ów)
- 10 min — test na tablicy testowej, wspólne prześledzenie V0/V1
