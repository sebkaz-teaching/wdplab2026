# Notatki prowadzącego — Ćwiczenie 5: Uruchomienie prawdziwej gry

To sesja "pokazowa" — brak nowego kodu do napisania, więc notatki są inne niż do
ćwiczeń 1-4: mniej o pułapkach składni, więcej o tym, jak to poprowadzić i co mieć
przygotowane wcześniej.

## Przygotowanie PRZED zajęciami (zrób to dzień wcześniej)

- Pobierz sam kilka ROM-ów testowych i 2-3 gry (np. z `chip8-test-suite` Timendusa i
  jakiegoś publicznego zbioru gier) — **nie licz na internet na sali**, miej je na
  pendrive/w repo zajęć do rozdania offline.
- Sam odpal je na swoim rozwiązaniu z ćwiczeń 1-4, żeby wiedzieć, które faktycznie
  działają z tym zakresem instrukcji (niektóre gry używają `FX55`/`FX65`, których
  ćwiczenia 1-4 nie wymagają wprost — patrz sekcja "Rozszerzenia").
- Sprawdź, które ROM-y są "bezpieczne" (nie wymagają rozszerzeń) — polecam zaczynać
  od nich, żeby każdy student miał szybki sukces, zanim przejdzie do trudniejszych.

## Punkty do omówienia (kolejność)

1. **To jest moment kulminacyjny kursu — nazwij to głośno.** Warto zatrzymać się na
   chwilę i powiedzieć wprost: "to, co za chwilę zobaczycie, to Wasz kod, uruchamiający
   grę z 1975 roku, bez żadnej biblioteki emulacyjnej — wszystko, co widzicie na
   ekranie, przeszło przez pętlę fetch-decode-execute, którą sami napisaliście."

2. **Zacznij od IBM logo, nie od gry.** Nawet jeśli część studentów już to
   testowała w ćwiczeniu 3, powtórzenie na forum buduje pewność przed czymś bardziej
   złożonym.

3. **Rozdaj ROM-y stopniowo, nie wszystkie naraz.** Ci, którym Pong nie działa od
   razu, będą potrzebować Twojej uwagi — łatwiej to ogarnąć, jeśli nie wszyscy
   utknęli na różnych grach jednocześnie.

## Typowe problemy na sali (i szybka diagnoza)

- **"U mnie czarny ekran"** — pierwsze pytanie: czy `chip8_load_rom` sprawdza
  faktyczny rozmiar wczytanego pliku? Częsty błąd: student otwiera plik w trybie
  tekstowym (`"r"` zamiast `"rb"`) na Windows/WSL, co psuje bajty.
- **"Gra miga/pojawiają się śmieci"** — 90% przypadków to zła kolejność bitów w
  `DXYN` z ćwiczenia 3, która nie ujawniła się na statycznym IBM logo, ale ujawnia
  się na czymś animowanym.
- **"Gra działa, ale zbyt szybko/wolno"** — każ sprawdzić stosunek cykli
  procesora do klatek z ćwiczenia 4 (`for (i=0;i<9;i++) chip8_cycle(...)` przed
  `usleep`) — różne gry były pisane z założeniem różnej prędkości, czasem trzeba
  podkręcić/zmniejszyć tę liczbę eksperymentalnie.
- **"Program wisi zaraz po starcie"** — sprawdź, czy `enable_raw_mode()` z
  ćwiczenia 4 rzeczywiście się wykonuje i czy `FX0A` nie blokuje w nieskończoność
  przez błąd w warunku "czy klawisz wciśnięty".

## Jak wykorzystać resztę czasu (rozszerzenia)

Studenci, którzy skończą szybko, zwykle pytają "co dalej?". Miej gotowe 2-3
konkretne zadania z sekcji "Rozszerzenia" (`FX33` BCD, `FX55`/`FX65`, dźwięk przez
`putchar('\a')`) — to naturalne, stopniowalne wyzwania, nie wymagają nowej teorii,
tylko dokładnego czytania specyfikacji opcode'ów.

## Zamknięcie kursu — warto powiedzieć wprost

Podsumowanie z materiału już to mówi, ale warto powtórzyć na głos: przez 18 sesji +
5 ćwiczeń przeszli od `printf("Hello")` do działającego emulatora uruchamiającego
prawdziwe gry — każdy koncept (zmienne, pętle, wskaźniki, struktury, pliki) miał
konkretny, namacalny cel, nie był "sztuką dla sztuki". To dobry moment, żeby zapytać
grupę, który moment kursu był dla nich największym "aha" — zbierasz w ten sposób
darmowy feedback do poprawek na przyszły rok.
