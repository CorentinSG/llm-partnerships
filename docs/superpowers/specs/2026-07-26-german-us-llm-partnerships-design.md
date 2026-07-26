# Section Allemagne–États-Unis des partenariats LL.M.

## Objectif

Ajouter au site une section autonome consacrée aux parcours formels entre facultés de droit allemandes et law schools américaines qui permettent, facilitent ou financent un LL.M. américain.

La section française existante reste la référence fonctionnelle et visuelle. Ses données, ses filtres, sa carte, ses fiches et son comportement ne sont pas modifiés. La nouvelle section allemande reprend la même expérience afin que l’utilisateur ne doive pas apprendre une nouvelle interface.

## Périmètre

La section allemande recense les 16 parcours publiés identifiés entre 9 facultés allemandes et des law schools américaines :

- Universität Augsburg : George Washington, Pittsburgh, Chicago-Kent et Santa Clara ;
- Freie Universität Berlin : UConn, UC Law San Francisco et University of Miami ;
- Universität Freiburg : UConn ;
- Universität Münster : UConn ;
- Universität Regensburg : UC Law San Francisco, avec une fiche pour les étudiants et une autre pour les diplômés ;
- Universität Mannheim : Vanderbilt et UConn ;
- Heinrich-Heine-Universität Düsseldorf : Suffolk, avec une fiche pour l’échange créditable et une autre pour le parcours post-examen ;
- Humboldt-Universität zu Berlin : University of Minnesota ;
- EBS Law School : Case Western Reserve.

Chaque entrée doit s’appuyer sur une source officielle de la faculté allemande ou de la law school américaine. Les informations non garanties ou non publiées sont indiquées comme telles avec les statuts de fiabilité existants.

## Navigation et architecture des pages

La page France–États-Unis actuelle demeure inchangée.

Une nouvelle route dédiée, `/germany`, présente la section Allemagne–États-Unis. Elle reprend la composition de la page française :

1. introduction au LL.M. américain et aux avantages des partenariats ;
2. recherche globale ;
3. filtres ;
4. carte de l’Allemagne et carte des États-Unis ;
5. légende des statuts ;
6. liste paginée des partenariats ;
7. simulateur de coût alimenté par les partenariats allemands.

La navigation principale permet de passer clairement entre les sections « France–États-Unis » et « Allemagne–États-Unis ». La page française conserve sa route actuelle. Les pages de détail existantes restent compatibles ; les nouvelles fiches allemandes utilisent le même composant de détail.

La page d’accueil ou l’en-tête général peut recevoir un sélecteur de section discret. Ce sélecteur ne remplace pas la mise en page existante et ne change pas le parcours français.

## Expérience visuelle

La section allemande reprend les composants, espacements, typographies, couleurs, états interactifs et densité de la section française. Elle ne crée pas de thème national décoratif et n’utilise pas les couleurs du drapeau allemand comme nouvelle palette.

Les différences nécessaires sont fonctionnelles :

- le titre mentionne une université allemande ;
- la carte d’origine représente l’Allemagne ;
- les filtres affichent « Université allemande » ;
- les textes et aides parlent du système juridique allemand lorsqu’une précision est nécessaire ;
- les libellés sont disponibles en français, anglais et espagnol.

La carte allemande affiche les 9 établissements recensés. Les établissements situés dans la même ville ou très proches doivent rester sélectionnables et accessibles au clavier.

## Classification des parcours

Les partenariats allemands ne présentent pas tous le même degré de directivité. Le type de partenariat existant est utilisé, complété si nécessaire par des valeurs compatibles avec l’interface :

- `dual_degree` : LL.M. intégré ou double diplôme pendant les études allemandes ;
- `pipeline` : nomination ou parcours formel facilitant l’admission au LL.M. ;
- `preferential_treatment` : bourse ou traitement financier réservé aux étudiants d’une faculté partenaire ;
- une catégorie explicite d’échange créditable lorsque le séjour ne délivre pas immédiatement le LL.M. mais réduit ou crédite le parcours ultérieur.

La carte de résultat et la fiche détaillée indiquent en langage clair :

- la nature du parcours ;
- le nombre de places ou de nominations lorsqu’il est publié ;
- la réduction, la bourse ou l’exonération ;
- le caractère automatique, discrétionnaire ou soumis à nomination ;
- le public concerné : étudiant en cours de cursus ou diplômé ;
- la date limite publiée et son année ;
- la source officielle ;
- les informations restant à confirmer.

Les deux dispositifs Regensburg–UC Law San Francisco et les deux dispositifs Düsseldorf–Suffolk restent séparés, car leurs publics, avantages et procédures diffèrent.

## Données et isolation

Les données allemandes sont stockées séparément des données françaises, dans un fichier dédié validé par le même schéma ou par une extension compatible de ce schéma.

La logique partagée peut être extraite ou paramétrée uniquement lorsque cela évite une duplication risquée sans changer le rendu français. Toute généralisation interne doit préserver :

- les identifiants et URLs françaises ;
- les résultats et compteurs français ;
- le fonctionnement actuel des filtres ;
- les libellés analytiques existants ;
- les données du simulateur français.

Les filtres et cartes de `/germany` ne lisent que les données allemandes. Le simulateur allemand ne propose que les partenariats allemands.

## Contenu général du site

Les textes de portée générale sont ajustés pour expliquer que le site couvre désormais deux sections : France–États-Unis et Allemagne–États-Unis. Cela concerne au minimum :

- les métadonnées du site ;
- la page « À propos » ;
- les textes de navigation ou d’introduction qui décrivent le périmètre global.

Les textes propres à la page française restent centrés sur les universités françaises. Les textes propres à `/germany` sont centrés sur les facultés allemandes.

## Sources et fraîcheur

La recherche complémentaire a déjà confirmé plusieurs informations actuelles :

- Freiburg publie 5 places annuelles vers UConn et une remise pouvant atteindre 50 % ;
- FU Berlin–Miami publie jusqu’à 2 places et une remise décidée par Miami entre 10 % et 50 % ;
- Münster publie jusqu’à 7 nominations vers UConn et une bourse pouvant atteindre 50 % ;
- Mannheim–Vanderbilt publie en 2026 une bourse de 50 000 USD pour au moins 2 diplômés ;
- Regensburg publie une remise de 75 % pour les étudiants et de 50 % pour les diplômés vers UC Law San Francisco.

Les montants, dates et quotas sont accompagnés de leur contexte temporel. Une date ancienne ne doit pas être présentée comme la prochaine échéance. Les pages officielles sont liées directement dans les fiches.

## Traductions

Toute nouvelle chaîne visible est fournie en français, anglais et espagnol selon le mécanisme existant. Les noms officiels allemands ne sont pas traduits. Les descriptions sont rédigées d’abord en français puis traduites avec le même sens, sans renforcer artificiellement une garantie d’admission ou de financement.

## États et erreurs

La section allemande reprend les états existants :

- aucun résultat après filtrage ;
- information confirmée ;
- information à confirmer ;
- information incomplète ;
- source ou montant non communiqué.

Une absence de quota, de montant ou de date n’empêche pas l’affichage d’une fiche si le partenariat lui-même est officiellement établi. Le champ manquant est signalé explicitement.

## Vérification

La livraison est validée par :

- validation du fichier de données et unicité des 16 identifiants ;
- vérification des 9 établissements sur la carte allemande ;
- tests des filtres, de la recherche, de la pagination et du simulateur sur `/germany` ;
- contrôle des pages de détail allemandes et de leurs liens officiels ;
- comparaison de non-régression de la page française avant et après modification ;
- vérification des versions française, anglaise et espagnole ;
- build de production ;
- contrôle visuel aux largeurs 375, 768, 1024 et grand écran ;
- contrôle clavier et focus des cartes, filtres et liens de navigation.

## Critères d’acceptation

La fonctionnalité est terminée lorsque :

1. l’utilisateur peut accéder clairement à une section Allemagne–États-Unis séparée ;
2. cette section fonctionne comme la section France–États-Unis ;
3. les 16 parcours allemands sont présents avec leur nature et leurs limites clairement indiquées ;
4. les sources officielles sont accessibles depuis les fiches ;
5. la section française conserve ses données, son apparence et son comportement ;
6. les textes généraux ne présentent plus le site comme exclusivement franco-américain ;
7. le site compile sans erreur et les parcours principaux sont vérifiés sur ordinateur et mobile.
