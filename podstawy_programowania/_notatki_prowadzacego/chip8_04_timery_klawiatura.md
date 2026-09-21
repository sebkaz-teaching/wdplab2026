# Notatki prowadzącego — Ćwiczenie 4: Timery i klawiatura

## Punkty do omówienia

1. **Dwie prędkości naraz — to jest koncepcyjny rdzeń tego ćwiczenia.** Narysować na
   tablicy dwie osie czasu: jedną tykającą szybko (procesor, ~540/s), drugą wolno
   (timery, 60/s), obie płynące równolegle, niezależnie. Podkreślić: "to pierwszy raz
   w kursie, gdzie jeden `main` robi dwie rzeczy w różnym tempie jednocześnie — bez
   wątków, tylko przez policzenie proporcji (9 cykli procesora na 1 tyknięcie timera)."

2. **Polling vs przerwania — dobre miejsce na pytanie retoryczne.** "Czy Wasza klawiatura
   w laptopie działa tak samo — system operacyjny bez przerwy pyta 'czy coś wciśnięto,
   czy coś wciśnięto, czy coś wciśnięto'?" (Nie — prawdziwy sprzęt budzi CPU
   przerwaniem.) Zaznaczyć: robimy tu uproszczenie świadomie, nie dlatego że nie
   umiemy inaczej.

3. **Tryb raw terminala — dla wielu to pierwszy kontakt z ideą, że terminal domyślnie
   "coś od nas ukrywa" (buforowanie liniowe, echo).** Warto zademonstrować różnicę na
   żywo: najpierw pokazać zwykłe `getchar()` (czeka na Enter), potem po
   `enable_raw_mode()` — reakcja natychmiastowa. Kontrast robi więcej niż opis.

## Typowe błędy

- **Nie wywołują `enable_raw_mode()` wcale albo za późno** (po pierwszej próbie odczytu)
  — klawiatura dalej czeka na Enter, student jest przekonany że kod z zadania 3 "nie
  działa", a właściwie nigdy się nie wykonał.
- **Zapominają `atexit(disable_raw_mode)`** — po Ctrl+C albo normalnym zakończeniu
  terminal zostaje w trybie raw (brak echo wpisywanych znaków) — **to jest bardzo
  częste i wygląda groźnie** ("zepsułem terminal!"). Ratunek doraźny: wpisać `reset`
  na ślepo i Enter, terminal wraca do normy. Warto to zapowiedzieć wcześniej, żeby nie
  panikowali.
- **Złe rozróżnienie `SKP`/`SKNP`** (ten sam wzorzec błędu co `SE`/`SNE` w ćwiczeniu 2 —
  warto to nazwać: "widzieliście już tę klasę pomyłki").
- **`FX0A` inkrementuje `pc` mimo braku wciśniętego klawisza** — instrukcja "ucieka"
  zamiast czekać, program leci dalej z niezainicjalizowanym rejestrem.

## Przewidywane pytania

**"Czemu dokładnie 60 Hz, a nie np. 100 albo 30?"**
Konwencja z ery analogowych telewizorów (odświeżanie NTSC ~60 Hz w USA, gdzie
powstał COSMAC VIP) — nie ma głębszego powodu technicznego dla samego CHIP-8, to
dziedzictwo sprzętu wyświetlającego tamtej epoki. Fajna dygresja: to ta sama liczba,
którą znają z "60 FPS" we współczesnych grach — nie przypadek, to ten sam rodowód
historyczny (częstotliwość sieci energetycznej w USA).

**"Co się stanie, jeśli program wywoła `FX0A`, a ja nic nie wcisnę?"**
Program czeka w nieskończoność, wykonując tę samą instrukcję w kółko — to jest
**zamierzone** zachowanie (czekanie na input), nie błąd. Dobra okazja odróżnić "program
czeka celowo" od "program się zawiesił przez błąd" — z zewnątrz wyglądają identycznie,
różni je tylko to, czy tak miało być.

## Podział czasowy (45 min)

- 5 min — dwie prędkości: rysunek dwóch osi czasu na tablicy
- 5 min — polling vs przerwania (dygresja koncepcyjna, krótka)
- 10 min — timery: pola + 3 opcode'y + pętla main z `usleep`
- 15 min — klawiatura: raw mode + mapowanie + `SKP`/`SKNP`/`FX0A`
- 10 min — test łączący wszystkie 4 ćwiczenia, sprawdzenie że terminal wraca do normy po wyjściu
