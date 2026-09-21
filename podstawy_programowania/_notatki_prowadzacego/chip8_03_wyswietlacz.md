# Notatki prowadzącego — Ćwiczenie 3: Wyświetlacz i sprite'y

## Punkty do omówienia

1. **Framebuffer — połączyć z czymś namacalnym.** Zapytać: "jak myślicie, jak Netflix
   wyświetla obraz na Waszym ekranie?" — dociągnąć do tego, że każdy obraz cyfrowy to
   w gruncie rzeczy tablica liczb, niezależnie od tego czy to 1 bit na piksel (nasz
   przypadek) czy 24-bitowy kolor. To najważniejsza "aha" chwila tego ćwiczenia —
   odczarowuje pojęcie "obrazu" jako czegoś magicznego.

2. **XOR jako rysowanie — demo na żywo, nie tylko tekst.** Narysować na tablicy siatkę
   4×4, zaznaczyć kilka pikseli jako "1". Poprosić studenta o narysowanie tego samego
   sprite'u w tym samym miejscu drugi raz przez XOR — powinni zobaczyć, że piksele
   znikają. To jest dużo lepsze niż tłumaczenie słowami "XOR jest swoją odwrotnością".

3. **Kolizja "za darmo"** — podkreślić, że to NIE jest specjalna dodatkowa logika,
   tylko efekt uboczny tego, jak działa XOR. Dobry moment na pytanie: "gdybyśmy użyli
   zwykłego OR zamiast XOR do rysowania, czy dałoby się wykryć kolizję tak samo
   łatwo?" (odpowiedź: nie — OR nigdy nie "gasi" piksela, więc nie da sygnału, że coś
   nachodzi na coś innego).

4. **Zawijanie na krawędziach (`% 64`, `% 32`)** — łatwo przeoczyć w treści zadania.
   Zapytać wprost: "co się stanie, jeśli sprite ma być narysowany na kolumnie 62, a ma
   szerokość 8 pikseli?" — bez modulo połowa sprite'u wyjdzie poza tablicę (realny
   crash albo, gorzej, ciche nadpisanie sąsiedniej pamięci).

## Typowe błędy

- **Zła kolejność bitów w bajcie** — czytają bit `0` jako najmniej znaczący zamiast
  najbardziej znaczący (sprite wychodzi "lustrzanie odbity" poziomo). Podpowiedź do
  szybkiej diagnozy: kazać narysować ręcznie na kartce, który bit `sprite_byte`
  odpowiada lewej krawędzi.
- **Zapominają wyzerować `VF` na początku `DXYN`** — kolizja z poprzedniego wywołania
  "przecieka" do następnego rysowania.
- **Nie sprawdzają flagi przerysowania w `main`** — albo migoczący ekran (przerysowują
  za każdy cykl procesora, nie za klatkę), albo statyczny ekran (nie przerysowują
  wcale, bo flaga nigdy nie jest odczytywana/zerowana poprawnie).
- **Zapominają skopiować `fontset` do pamięci w `chip8_init`** — `FX29` (lokalizacja
  cyfry) wskazuje na śmieci zamiast prawdziwych danych sprite'u.

## Przewidywane pytania

**"Czemu 1 bajt na piksel zamiast bitów (`display[64*32/8]`)?"**
Bo to prostsze do zaimplementowania i debugowania na tym etapie — indeksowanie
`display[y*64+x]` bez dodatkowej arytmetyki bitowej. Kosztem jest 8x więcej pamięci
niż potrzeba (256 bajtów zamiast 32) — dla współczesnego komputera to nic, dla
oryginalnego sprzętu z 1977 roku byłoby to marnotrawstwo nie do przyjęcia. Dobra
okazja żeby powiedzieć: "robimy tu świadomy kompromis czytelność-kod vs
efektywność-pamięciowa, który prawdziwi twórcy CHIP-8 nie mieli luksusu zrobić."

**"Dlaczego IBM logo, a nie od razu jakaś gra?"**
Bo nie wymaga klawiatury ani timerów (których jeszcze nie macie — to ćwiczenie 4) —
testuje WYŁĄCZNIE rysowanie, w izolacji od reszty systemu. To dobra okazja do
uogólnienia: "testujcie jedną rzecz na raz, zanim złożycie wszystko razem" — zasada
uniwersalna, nie tylko do CHIP-8.

## Podział czasowy (45 min)

- 5 min — framebuffer jako koncept (analogia z ekranem)
- 10 min — XOR demo na tablicy + kolizja "za darmo"
- 20 min — kodowanie (DXYN to najtrudniejsza pojedyncza instrukcja w całym kursie —
  dać na to najwięcej czasu, obchodzić salę aktywnie)
- 10 min — uruchomienie IBM logo, wspólne świętowanie pierwszego widocznego efektu
