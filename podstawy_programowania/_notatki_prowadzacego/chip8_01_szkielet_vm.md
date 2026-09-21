# Notatki prowadzącego — Ćwiczenie 1: Szkielet VM

Do mówienia na głos, nie do czytania studentom z ekranu. Pełna teoria jest w
`01_szkielet_vm.qmd` — to tylko skrót + FAQ.

## Punkty do omówienia (kolejność)

1. **Analogia otwierająca**: "Za chwilę napiszecie w kilka tygodni to, co Intel/AMD
   robi w krzemie — tylko wolniej i w C zamiast w tranzystorach." Zawiesić na chwilę,
   niech dotrze.

2. **Von Neumann → tabela odpowiedniości**. Nie czytać tabeli z ekranu — narysować na
   tablicy pustą tabelę (2 kolumny: "prawdziwy procesor" / "nasz kod"), wypełniać razem
   ze studentami pytając "jak myślicie, co odpowiada rejestrowi PC w naszym C?".
   Wciąganie ich w wypełnianie działa lepiej niż pokazanie gotowej tabeli.

3. **"Płaska pamięć" — callout o segmentach**. To dobry moment na pytanie kontrolne:
   "co się stanie, jeśli program CHIP-8 nadpisze własny kod?" (odp.: nic go nie
   powstrzyma, to celowe uproszczenie względem współczesnych OS-ów z ochroną pamięci).

4. **Endianness — NAJWAŻNIEJSZY punkt tego ćwiczenia do wytłumaczenia wolno.**
   Narysować na tablicy dwie komórki pamięci obok siebie z adresami, fizycznie pokazać
   palcem który bajt "idzie pierwszy". Studenci **notorycznie** mylą to z odwrotną
   kolejnością przy pierwszym kontakcie — nie spieszyć się tutaj, to jedyny nowy
   koncept teoretyczny w tym ćwiczeniu, reszta to "programistyczna" implementacja
   fetch-decode-execute.

5. **Fetch-decode-execute jako pętla `for`/`while`** — podkreślić, że to dosłownie
   pętla, którą już znają (sesje wcześniejsze) — nic magicznego, tylko `switch` zamiast
   `if-else`.

## Typowe błędy studentów (do wyłapania przy obchodzeniu sali)

- **Zapominają zwiększyć `pc` PRZED wykonaniem instrukcji** (task 4 mówi o tym wprost,
  ale i tak ginie w praktyce) — objaw: `JP` skacze, ale potem program się zapętla w
  złym miejscu, bo `pc` zostało podwójnie zmodyfikowane albo wcale.
- **Odwracają kolejność bajtów przy fetch** (`memory[pc+1] << 8 | memory[pc]` zamiast
  odwrotnie) — objaw: testowy ROM z zadania robi coś kompletnie nielogicznego (skacze
  w losowe miejsca). To bezpośrednia konsekwencja niezrozumienia endianness z punktu 4.
- **Nie maskują NNN poprawnie** (`opcode & 0x0FFF` dla adresu) — biorą cały opcode
  zamiast dolnych 12 bitów, JP i CALL skaczą w złe miejsca.
- **Struct `Chip8` alokowana lokalnie ale przekazywana przez wartość, nie wskaźnik** do
  funkcji pomocniczych, którą sami dopiszą później — jeszcze nie problem w tym
  ćwiczeniu (wszystko w jednym `main`), ale zapowiedzieć, że w ćwiczeniu 2 zaczną
  wydzielać funkcje i to wypłynie.

## Przewidywane pytania i gotowe odpowiedzi

**"Czemu pamięć to `uint8_t[4096]` a nie np. `int[4096]`?"**
Bo prawdziwa pamięć RAM adresuje pojedyncze bajty, nie 4-bajtowe inty — `uint8_t`
(dokładnie 1 bajt, zawsze, na każdej platformie) to najwierniejszy model tego, czym
naprawdę jest pamięć. Gdybyśmy użyli `int`, zużylibyśmy 4x więcej pamięci niż realny
CHIP-8 miał w ogóle (4 KB).

**"Dlaczego akurat 0x200 jako adres startowy, a nie 0?"**
Bo oryginalny interpreter CHIP-8 sam zajmował adresy 0x000–0x1FF (tam dziś ładujemy
tylko zestaw czcionek w ćwiczeniu 3) — to konwencja historyczna, nie techniczna
konieczność. Warto powiedzieć wprost: "gdybyśmy projektowali to dziś od zera, pewnie
zaczęlibyśmy od 0 — ale kompatybilność z istniejącymi ROM-ami wymaga trzymania się
oryginalnego adresu."

**"Co się stanie, jeśli opcode nie pasuje do żadnego znanego przypadku?"**
Dokładnie to, co robi kod startowy w `default:` — wypisuje błąd i (na razie) nic więcej.
To celowe: w ćwiczeniach 2-4 będą dopisywać kolejne case'y, a `default` zostaje ich
"czujnikiem dymu" — jeśli coś nie działa, pierwsze miejsce do sprawdzenia to stderr.

**"Czy to jest to samo, co robi prawdziwy procesor w moim laptopie?"**
Zasada (fetch-decode-execute) — tak, dokładnie ta sama. Skala i szybkość — zupełnie
nie: Wasz procesor robi to miliardy razy na sekundę, w krzemie, z wieloma poziomami
cache i przewidywaniem rozgałęzień. To, co piszecie, to model edukacyjny tej samej
idei, nie symulator prawdziwego x86/ARM.

## Podział czasowy (orientacyjny, 45 min)

- 5 min — analogia otwierająca + zapowiedź całego semestru (co zbudujemy)
- 15 min — teoria: tabela Von Neumann + endianness (najwolniej właśnie tu)
- 20 min — kodowanie zadań 1-5, obchodzenie sali
- 5 min — wspólne uruchomienie testowego ROM-u, sprawdzenie że PC leci 0x200→0x204→0x206
