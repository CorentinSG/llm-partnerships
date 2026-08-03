# Annuaire LL.M. Royaume-Uni–États-Unis — conception

## Objectif

Ajouter au site une quatrième section autonome consacrée aux parcours LL.M. formalisés entre des universités britanniques et des law schools américaines, sans modifier le contenu ni le comportement des trois annuaires existants.

## Source et périmètre

- Source fournie : Google Doc `annuairellmukusa.md`, lu comme source de contenu et non comme modèle visuel.
- Recherche complémentaire : pages officielles des universités et law schools uniquement.
- Inclure quatre relations institutionnelles : King’s College London–Georgetown, Queen Mary–William & Mary, Bristol–Cardozo et Dundee–American University WCL.
- Représenter séparément les deux LL.M. Georgetown (General Studies et International Legal Studies), soit cinq parcours pour quatre partenariats.
- Signaler sans ambiguïté les données datées, non publiées ou seulement corroborées par une partie.

## Expérience utilisateur

- Nouvelle route `/uk` et nouvelle entrée de navigation, sur ordinateur comme sur mobile.
- Même composition que les pages Allemagne et Italie : introduction, recherche, filtres, cartes Royaume-Uni/États-Unis, cartes de résultats, estimateur de coût et fiches détaillées.
- Carte du Royaume-Uni avec les quatre établissements d’origine.
- Le texte d’introduction explique la rareté du sens Royaume-Uni → États-Unis et distingue un véritable LL.M. du simple échange Dundee–AUWCL qui ne confère pas le diplôme à lui seul.
- Les cinq langues existantes — français, anglais, espagnol, allemand et italien — couvrent chaque libellé de page et chaque valeur de données affichée.

## Données et fiabilité

- King’s–Georgetown : confirmé, candidature en deuxième année, 20 crédits, restriction explicite pour le New York Bar.
- Queen Mary–William & Mary : à reconfirmer annuellement ; la page QMUL actuelle annonce une bourse annuelle de 10 000 USD et l’admission au LL.M., tandis que les anciens avantages plus larges du document source ne sont pas présentés comme actuels sans preuve.
- Bristol–Cardozo : confirmé ; remise/bourse de 50 %, tuition Cardozo 2026–2027 de 77 602 USD et 1 170 USD de frais, soit une tuition indicative de 38 801 USD avant frais et vie.
- Dundee–AUWCL : partenaire confirmé côté AUWCL ; un semestre d’échange, nomination obligatoire, échéances du 1er mai et du 1er octobre, jusqu’à 12 crédits transférables vers un LL.M. complet distinct.
- Les décisions d’admission et d’éligibilité à un barreau restent individuelles.

## Architecture

- `data/uk-database.json` contient les institutions et cinq parcours dans le schéma déjà utilisé.
- `src/lib/uk-data.ts` adapte ces données au type commun `Partnership`.
- `data/uk-translations.json` fournit toutes les valeurs en EN/ES/DE/IT ; le français reste la langue source.
- `src/components/uk-map.tsx`, `src/components/pages/uk-home-page.tsx` et `src/app/uk/page.tsx` reproduisent le système existant sans refactoriser les annuaires historiques.
- La résolution de `/partnership/[id]` reconnaît les identifiants britanniques et renvoie vers `/uk`.

## Validation et publication

- Tests test-first pour la structure des données, la couverture des traductions, l’intégration de la page/navigation/fiches et le rendu navigateur.
- Régression complète des annuaires France, Allemagne et Italie, puis build Next.js.
- Push sur `master`, déploiement Vercel en production et vérification HTTP de `/uk` et d’une fiche britannique.
