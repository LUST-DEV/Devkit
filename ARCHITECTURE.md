# DEVKIT — Architecture officielle

**Slogan :** One workspace. Every developer tool.

**Version du document :** 1.0
**Licence :** MIT
**Statut :** Architecture validée — préparation du développement.

---

## 1. Vision du projet

DEVKIT est une boîte à outils open source destinée aux développeurs du monde entier.

L'objectif est de réunir des outils de développement utiles dans une seule application moderne, rapide, sécurisée, accessible et utilisable hors ligne.

### Principes fondamentaux

- Local-first : les opérations sont réalisées dans le navigateur autant que possible.
- Aucun compte obligatoire.
- Aucun backend obligatoire.
- Confidentialité par défaut.
- Application légère et performante.
- Architecture modulaire et évolutive.
- Code maintenable et testé.
- Interface responsive.
- Open source sous licence MIT.

## 2. Technologies officielles

| Domaine | Technologie |
| --- | --- |
| Interface | React |
| Langage | TypeScript |
| Build | Vite |
| CSS | Tailwind CSS |
| Icônes | Lucide React |
| Navigation | React Router |
| Gestion des paquets | pnpm |
| Tests unitaires | Vitest |
| Tests UI | Testing Library |
| Tests E2E | Playwright |
| Éditeur avancé | CodeMirror 6 |
| Déploiement | Cloudflare Pages |
| CI/CD | GitHub Actions |

Toutes les dépendances doivent être justifiées, maintenues, auditées et compatibles avec la licence MIT du projet.

Les versions de Node.js, pnpm et des dépendances doivent être documentées et reproductibles.

## 3. Architecture générale

DEVKIT utilise une application frontend unique.

Aucun monorepo n'est nécessaire pour le MVP.

L'architecture doit séparer :

- l'interface utilisateur ;
- la logique métier ;
- les outils indépendants ;
- les fonctionnalités partagées ;
- les services du navigateur ;
- les traductions ;
- les tests.

### Structure indicative

```
DEVKIT/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── tools/
│   │   ├── json/
│   │   ├── base64/
│   │   ├── uuid/
│   │   ├── jwt/
│   │   ├── timestamp/
│   │   └── hash/
│   ├── editor/
│   ├── features/
│   ├── hooks/
│   ├── i18n/
│   ├── lib/
│   ├── styles/
│   ├── types/
│   └── utils/
├── tests/
├── docs/
│   └── adr/
├── .github/
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
├── README.md
├── LICENSE
└── ARCHITECTURE.md
```

Cette structure est une référence, pas une obligation de créer des dossiers vides. Chaque fichier doit avoir une utilité réelle.

## 4. Tool Registry

Les outils doivent être enregistrés dans un registre central.

Le registre contient leurs métadonnées :

- identifiant ;
- nom ;
- description ;
- catégorie ;
- icône ;
- route ;
- disponibilité ;
- informations de navigation.

La logique métier de chaque outil reste indépendante.

Aucun outil ne doit dépendre directement de la logique interne d'un autre outil.

Les plugins tiers exécutables sont exclus de la version 1.0.

## 5. MVP — Version 1.0

Six outils sont obligatoires :

1. JSON Formatter & Validator
2. Base64 Encoder / Decoder
3. UUID Generator
4. JWT Decoder
5. Timestamp Converter
6. Hash Generator

### Exigences spécifiques

**JSON Formatter**

- Formatage.
- Validation.
- Gestion des erreurs.
- Affichage lisible.

**Base64**

- Encodage.
- Décodage.
- Gestion des caractères Unicode.
- Messages d'erreur explicites.

**UUID**

- Génération d'identifiants.
- Utilisation d'une API cryptographiquement sûre lorsqu'elle est disponible.

**JWT Decoder**

- Décodage des informations d'un JWT.
- Affichage du Header et du Payload.
- Avertissement explicite : le décodage ne vérifie pas la signature.
- Ne jamais prétendre valider l'authenticité du token.

**Timestamp Converter**

- Conversion entre timestamps et dates.
- Gestion UTC.
- Gestion des fuseaux horaires.
- Formats régionaux.

**Hash Generator**

- SHA-256.
- SHA-384.
- SHA-512.
- Utilisation de Web Crypto API.

### Roadmap

- v1.0.0 : six outils MVP.
- v1.1.0 : Regex Tester et Text Diff.
- v1.2.0 : Markdown Preview.
- v2.0.0 : API Request Builder après conception de sa sécurité.

## 6. Navigation et interface

Routes principales :

```
/
/tools
/tools/json
/tools/base64
/tools/uuid
/tools/jwt
/tools/timestamp
/tools/hash
/help
/settings
```

Une route 404 est obligatoire.

### Navigation

- Sidebar fixe et rétractable sur ordinateur.
- Sidebar latérale ouvrable sur mobile.
- Interface adaptative sur tablette.
- Chargement différé des outils.
- Navigation sans rechargement complet.

### Dashboard

- Accueil.
- Recherche globale.
- Favoris.
- Outils récemment utilisés.
- Accès aux six outils.
- Help Center.
- Indicateur de confidentialité.

### Recherche

- Recherche instantanée locale.
- Recherche des outils, catégories, paramètres et documentation.
- Palette de commandes avec Ctrl+K.
- Navigation clavier et tactile.
- Pas d'historique de recherche par défaut.

### Favoris et outils récents

- Favoris enregistrés localement.
- Maximum de cinq outils récemment utilisés.
- Aucun contenu saisi ou résultat conservé.
- Fonction désactivable.

## 7. Design System

Identité visuelle :

- Bleu nuit et noir.
- Bleu électrique comme couleur principale.
- Cyan comme couleur secondaire.
- Texte blanc.
- Bordures discrètes.
- Glassmorphism modéré.
- Neumorphism utilisé avec retenue.
- Animations légères.

Aucun dégradé violet ne doit constituer l'identité principale.

Les icônes doivent être des SVG via Lucide React ou des SVG personnalisés.

Aucun emoji dans l'interface du produit.

### Thèmes

- Dark.
- Light.
- System.

### Effets visuels

- Minimal.
- Balanced (par défaut).
- Premium.

Les effets doivent être adaptatifs aux performances des appareils.

## 8. Responsive et accessibilité

Appareils pris en charge :

- Windows.
- macOS.
- Linux.
- Android.
- iOS.
- iPadOS.

Navigateurs :

- Chrome, Firefox, Edge et Safari evergreen.
- Les deux dernières versions majeures.
- Navigateurs mobiles récents.

Objectif d'accessibilité : WCAG 2.2 AA.

Exigences :

- Navigation clavier.
- Focus visible.
- Contrastes suffisants.
- Compatibilité lecteurs d'écran.
- Zones tactiles adaptées.
- Respect de prefers-reduced-motion.

## 9. Éditeur

Architecture hybride :

- Textarea native pour les opérations simples.
- CodeMirror 6 pour les besoins avancés.
- Chargement de CodeMirror uniquement lorsque nécessaire.
- Adaptation mobile.
- Coloration syntaxique selon les besoins.

## 10. État et stockage

Utiliser les fonctionnalités natives de React :

- Context.
- useState.
- useReducer.

Aucune dépendance Redux ou Zustand pour le MVP.

### Politique de stockage

- LocalStorage pour les petites préférences.
- IndexedDB uniquement si nécessaire.
- Données temporaires en mémoire.
- Aucun stockage automatique des entrées ou résultats des outils.
- Aucun stockage automatique de JWT, API keys, mots de passe ou secrets.
- Aucun compte obligatoire.

L'historique est désactivé par défaut et toute future activation doit être explicite.

### Sauvegarde manuelle

Export et import locaux des préférences uniquement.

Les sauvegardes doivent :

- utiliser JSON ;
- inclure une version de schéma ;
- inclure un timestamp ;
- être strictement validées ;
- ne jamais exécuter le contenu importé ;
- présenter un aperçu avant remplacement ;
- demander confirmation.

Les migrations doivent être versionnées et contrôlées. En cas d'échec, préserver les données originales.

Aucune synchronisation cloud.

## 11. Confidentialité et télémétrie

Aucune télémétrie implémentée dans v1.0.

L'architecture peut accueillir une télémétrie facultative dans une version future, après décision explicite.

Aucun transfert automatique vers un service externe.

Ne jamais transmettre :

- entrées utilisateur ;
- résultats des outils ;
- JWT ;
- API keys ;
- mots de passe ;
- secrets ;
- données personnelles.

L'application doit fonctionner complètement sans télémétrie.

## 12. Sécurité

La sécurité est une exigence permanente.

### Frontend

- Validation stricte des entrées.
- Limitation des tailles de données lorsque nécessaire.
- Protection XSS.
- Rendu sûr des contenus non fiables.
- Aucune exécution de code importé.
- Aucun secret dans le frontend.
- Aucune clé privée dans le dépôt.
- Gestion sûre des erreurs.
- HTTPS en production.

### Backend éventuel

Aucun backend obligatoire dans v1.0.

Si un backend est introduit ultérieurement :

- requêtes SQL paramétrées ;
- protection CSRF si applicable ;
- contrôles d'accès ;
- limitation de débit ;
- protections anti-abus et anti-spam ;
- validation des entrées ;
- gestion sécurisée des secrets ;
- politique CORS stricte.

La protection contre les injections SQL ne doit pas entraîner l'introduction inutile d'une base de données.

### Dépendances

- Audit régulier.
- Vérification des licences.
- Vérification de la maintenance.
- Vérification des vulnérabilités.
- Lockfile obligatoire.
- Pas de dépendance inutilisée.

### API Request Builder — v2.0

Une analyse de sécurité distincte sera obligatoire avant son développement :

- CORS ;
- requêtes externes ;
- gestion des secrets ;
- limitation des abus ;
- protections contre les requêtes dangereuses ;
- absence d'exposition de données sensibles.

## 13. Gestion des erreurs

Les erreurs doivent être gérées à plusieurs niveaux :

- erreurs métier au niveau de chaque outil ;
- Error Boundaries React ;
- fallback global ;
- route 404 ;
- possibilité de réessayer ;
- retour au Dashboard.

Ne jamais afficher une page blanche.

Ne jamais exposer les secrets, JWT, chemins internes ou informations sensibles.

Ne jamais perdre silencieusement les données temporaires.

Les diagnostics restent locaux.

## 14. Exécution et performances

Stratégie hybride :

- opérations légères sur le thread principal ;
- Web Workers lorsque les traitements le justifient.

Exigences :

- Lazy loading.
- Code splitting.
- Optimisation des SVG.
- Dépendances limitées.
- Animations modérées.
- Attention particulière aux appareils Android modestes.

Objectifs de performance :

- LCP ≤ 2,5 secondes.
- INP ≤ 200 ms.
- CLS ≤ 0,1.

Ce sont des objectifs de qualité, pas des garanties.

## 15. PWA et fonctionnement hors ligne

DEVKIT doit être une PWA complète.

Fonctionnalités :

- Installation sur Android et ordinateur.
- Fonctionnement hors ligne après installation et mise en cache des ressources essentielles.
- Six outils MVP fonctionnels hors ligne.
- Indicateur en ligne/hors ligne.
- Page de secours hors ligne.

### Cache

Autorisé :

- HTML.
- CSS.
- JavaScript.
- Icônes.
- Polices locales.

Interdit par défaut :

- entrées utilisateur ;
- résultats ;
- JWT ;
- API keys ;
- secrets ;
- ressources externes non nécessaires.

Service Worker :

- caches versionnés ;
- nettoyage des anciens caches après activation réussie ;
- aucune synchronisation en arrière-plan.

### Mises à jour

Stratégie : prompt.

Lorsqu'une nouvelle version est disponible :

- afficher une notification ;
- proposer Reload ou Later ;
- ne jamais recharger silencieusement ;
- avertir en présence de travail temporaire non sauvegardé ;
- préserver les préférences locales.

L'installation ne doit pas être intrusive.

Aucune notification push dans v1.0.

## 16. Langues et formats régionaux

Langues initiales :

- Anglais (par défaut).
- Français.
- Espagnol.

Détection initiale selon le navigateur, avec fallback anglais.

Les traductions doivent être centralisées.

Les formats de date et d'heure doivent respecter les paramètres régionaux.

Fuseau horaire local détecté et modifiable.

Conversion UTC disponible.

## 17. Onboarding et documentation utilisateur

### Guided Tour

- Guide général au premier lancement.
- Possibilité de passer.
- Mini-guides indépendants pour chaque outil.
- Progression conservée localement.
- Redémarrage depuis Help Center ou Settings.
- Navigation clavier et tactile.

### Help Center

- Guided Tour.
- Documentation.
- Keyboard Shortcuts.
- FAQ.
- Report a Bug.
- Feedback.
- About DEVKIT.

Les rapports de bugs ne doivent jamais joindre automatiquement les entrées des outils, JWT ou API keys.

## 18. Raccourcis clavier

- Ctrl+K : recherche globale.
- Ctrl+S : export lorsqu'il est applicable.
- Ctrl+Enter : exécution.
- Ctrl+Shift+C : copie du résultat.
- Esc : fermeture d'un panneau ou dialogue.

Prise en charge des variantes Cmd sur macOS.

Les raccourcis ne doivent pas casser les fonctionnalités natives du navigateur.

## 19. Tests et qualité

### Tests unitaires

Vitest.

Tester :

- logique métier ;
- entrées valides ;
- entrées invalides ;
- limites ;
- erreurs.

### Tests d'intégration

Testing Library.

Tester :

- interactions ;
- validation ;
- notifications ;
- recherche ;
- favoris ;
- paramètres ;
- navigation ;
- registre des outils.

### Tests E2E

Playwright.

Tester :

- parcours utilisateur essentiels ;
- outils MVP ;
- mobile ;
- installation et fonctionnement PWA de base.

### Objectifs de couverture

- 90 % pour la logique métier des outils.
- 85 % pour les utilitaires.
- 80 % pour l'application globale.

La couverture ne remplace pas la qualité réelle des tests.

## 20. CI/CD

GitHub Actions doit contrôler :

- TypeScript.
- ESLint.
- Tests.
- Build de production.
- Audit de dépendances.
- Détection de secrets.

Les contrôles obligatoires doivent réussir avant fusion.

Les modifications de code nécessitent une Pull Request et une revue humaine.

La branche main doit être protégée.

Les modifications de documentation uniquement peuvent utiliser un workflow allégé si aucun code n'est concerné.

## 21. Déploiement

Cloudflare Pages.

- Dépôt officiel sur GitHub.
- Déploiement de production depuis main.
- Previews pour les Pull Requests.
- HTTPS.
- Headers de sécurité.
- Fallback SPA pour React Router.
- Domaine personnalisé comme URL principale.
- Sous-domaine Cloudflare Pages comme URL technique et de prévisualisation.

Aucun secret ne doit être stocké dans le frontend ou dans le dépôt.

## 22. Maintenance et gouvernance

Gouvernance open source avec revue obligatoire.

Cycle de contribution :

Issue → Pull Request → CI → Revue humaine → Merge → Release.

La branche main est protégée.

Chaque contributeur peut proposer des changements.

Les changements architecturaux importants doivent être documentés dans des ADR.

### ADR

Les ADR doivent inclure :

- contexte ;
- décision ;
- alternatives ;
- conséquences ;
- date ;
- statut.

Les décisions remplacées restent archivées.

Les changements mineurs ne nécessitent pas systématiquement un ADR.

### Mainteneurs

- Mainteneur principal.
- Mainteneur secondaire.
- Permissions minimales nécessaires.
- Continuité de maintenance documentée.

### Dépendances

Toute nouvelle dépendance doit avoir une raison claire, être compatible avec la licence du projet et être contrôlée avant intégration.

## 23. Versionnement et releases

SemVer :

- MAJOR.
- MINOR.
- PATCH.

Préversions :

- alpha ;
- beta ;
- RC.

Chaque release doit inclure :

- Git tag ;
- notes de version ;
- changelog ;
- instructions d'installation ;
- problèmes connus ;
- artefacts ZIP vérifiés.

Les ZIP doivent être reproductibles depuis le code source du tag correspondant.

### Contrôle obligatoire avant ZIP

- Relecture du code.
- TypeScript.
- ESLint.
- Tests.
- Build.
- Audit de sécurité.
- Vérification des dépendances.
- Recherche de secrets.
- Vérification des fichiers inclus.
- Suppression des fichiers inutiles.

Aucune livraison si des erreurs critiques ou bloquantes subsistent.

## 24. Documentation officielle

Documents prévus :

- README.md
- LICENSE
- CONTRIBUTING.md
- CODE_OF_CONDUCT.md
- SECURITY.md
- CHANGELOG.md
- ROADMAP.md
- ARCHITECTURE.md
- Documentation des outils.
- Documentation développeur.
- Templates GitHub Issues et Pull Requests.
- Workflow CI.

La documentation doit rester cohérente avec le comportement réel du logiciel.

## 25. Compatibilité des données

Les données locales doivent utiliser des schémas versionnés.

Les migrations doivent :

- être progressives ;
- être validées ;
- être contrôlées ;
- préserver les données originales en cas d'échec.

## 26. Évolution future

Les fonctionnalités futures doivent respecter :

- architecture locale-first ;
- confidentialité ;
- sécurité ;
- accessibilité ;
- performances mobiles ;
- maintenabilité.

Aucun ajout ne doit justifier une complexité disproportionnée.

Les plugins tiers nécessiteront une conception de permissions, validation et isolation avant toute implémentation.

---

**Règle finale :** la simplicité, la sécurité, la confidentialité et la maintenabilité priment sur l'accumulation de fonctionnalités.
