# Proof of Concept del gruppo BloomSoft
Questa repo contiene il codice relativo alla cli del progetto Etherless.
## Operazioni preliminari
Prima di eseguire i comandi che verranno descritti successivamente, le seguenti operazioni devono essere svolte oltre al clone della repo per garantirne il corretto funzionamento:
- eseguire il comando "npm install" per installare tutti i moduli, se ci sono degli errori rifare il comando con i permessi di amministratore oppure ritentare (è probabile che servano più tentativi per installare tutto correttamente);
- controllare di avere la cartella .credentials con all'interno un solo file txt (verrà popolato con altri due file di configurazione del wallet ETH);
- per eseguire il comando run è necessario eseguire prima la funzione presente nell'altra repo (etherless-server);
- installare PostMan per verificare il credito dei wallet e lo stato dei contratti.
## Comandi disponibili
- ts-node . init : verrà chiesto che creare un nuovo wallet ETH oppure associarne uno già esistente (verrà chiesto tra link e create), una volta ottenuto il wallet verranno creati i file in .credentials con la chiave e l'indirizzo del wallet. I wallet creati hanno balance 0, per inserire del credito è necessario andare sul link https://faucet.ropsten.be e inserire l'indirizzo del proprio wallet (è possibile una richiesta ogni 24 ore), per verificare il buon esito dell'operazione andare su PostMan e inserire in GET "https://api-ropsten.etherscan.io/api?module=account&action=balance&address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae&tag=latest&apikey=YourApiKeyToken" aggiungendo sotto nel campo "address" l'indirizzo del proprio wallet;
- ts-node . deployContract nomeContratto.sol : serve per caricare un contratto nella TestNet Ropsten in modo da poterlo utilizzare (il contratto viene compilato prima di essere caricato); se viene caricato viene restituito a video l'indirizzo del contratto, in caso contrario verrà restituito false (per mancanza di soldi nel wallet di chi ha digitato il comando, quindi assicurarsi di usare un wallet con balance non vuoto). Per verificare il buon esito dell'operazione andare su PostMan e inserire in GET "https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=0xd13964b47d6AdB450aEb2aeCb213c7410d22213C&apikey=YourApiKeyToken" aggiungendo sotto nel campo address (o contracat) l'indirizzo del contratto (che viene stampato dalla cli in caso di successo del deploy). Probabilmente il risultato dirà che il contratto non è verificato, è possibile farlo su https://ropsten.etherscan.io/verifyContract inserendo:
    1) Indirizzo del contratto;
    2) Versione del compilatore (0.5.16);
    3) Licenza (Nessuna Licenza);
    4) Successivamente chiede il codice sorgente, è sufficiente copiare il TUTTO codice contenuto in nomeContratto.sol (commenti e spazi inclusi).
- ts-node . run add param1 param2 : attualmente è disponibile solo l'esecuzione di una funzione che fa la somma tra due numeri (param1 e param2), la funzione verrà fatta girare su etherless-server che invierà alla cli il risultato;
- ts-node . logout : scollega il wallet ETH cancellando i file contenuti in .credentials (ad eccezione del txt che serviva solo per mantenere la cartella), non è possibile recuperare gli indirizzi e la chiave dei wallet cancellati, quindi non utilizzare su un wallet con del balance (per via delle 24 ore prima di ottenere altri ETH sul wallet, altrimenti non è possibile fare il deploy).