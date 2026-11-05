# Références de design

- `pages/` — une maquette HTML statique par page, générée depuis la maquette validée. S'ouvre directement dans le navigateur (les assets pointent vers `../../public/`). Sert de modèle visuel : ne pas copier le HTML tel quel, le reconstruire en composants Astro.
- `holocene-site-complet.html` — tout le site en un seul fichier autonome, navigable (bouton « Pages » en bas à droite).
- `charte/` — planches du brand book (marque mère, food truck, traiteur, restaurant), texte d'intention, cartes restaurant/food truck et box traiteur.

Pages interactives (Journal, Contact, Design system) : les fichiers de `pages/` montrent l'état par défaut ; `holocene-site-complet.html` montre les interactions.
