# Sprint review n°4

## MVP 3

- Mockup pages web (frontend) : ABA
- Interface web pour les utilisateurs (frontend) : ABA - JST
  - Page register
  - User preference
  - ... (a definir) ...
- Interface web pour les entités (frontend) : ABA - JST
  - Page creation
  - Validation par admin
  - ... (a definir) ...
- API Offres/demandes et catégories
  - Definir les routes : NM - CLU
  - Créer l'API : NM - CLU
  - Tester une méthode de stockage d'objets "dynamiques" qui permettrait aux catégories d'avoir des champs différents, avec outils de création de catégorie : JDE

### Ajout en cours de sprint

- API messaging (communication entre utilisateurs) : JDE
  - définir les routes
  - implémentation API
  - test
- API Offres/demandes et catégories
  - "matching strategy" : JDE


## Rétrospective

- API Offres/demandes et catégories : **done**
- API messaging : **done**
- Interface web pour les utilisateurs : **done**
- Interface web pour les entités (frontend) : **reporté**
- Mockup pages web (frontend) : **partiel**

### Reporté

- Interface web pour les entités

## Objectif meeting 

- Discuter de ce qu'on rend 
- Discuter de la situation
- Discuter de la présentation
- Définir le produit final

## Delivrables

- Image docker : JST
- Document analyse : ABA 
- Document projet : JDE
- Vidéo démonstration : JDE (backend only)
- Support présentation : ABA

## MVP 4

- Interface web pour les publications (offres/demandes) (frontend)
- Interface web pour la messagerie (offres/demandes) (frontend)
- Interface web l'admin (frontend)
- Revoir documentation existante (rapport solution) : **tout le monde**
- Plus de nouvelle fonctionnalité backend
  - sauf corrections / nouvelles opérations sur objets existants
  - forget password ==> email ? **JDE**
  - Routes get publication by user / by type ==> offres / demandes  **JDE**

### Nice to have

- Interface web pour les entités (frontend) : **report**

## Idées futures

- "Maintenance mode" avec message d'alerte possible

## Schedule

```mermaid
gantt
dateFormat  YYYY-MM-DD
title Schedule

section Global
Sprint 1              :done,    s1, 2022-02-20, 1w
Sprint 2              :done,    s2, after s1, 2w
Analyse sprint 2      :done,    s2t1, after s1, 1w
Analyse sprint+1      :done,    s2t2, after s2t1, 1w
Analyse Globale       :done,    s2t3, after s1, 4w
Sprint 3              :done,    s3, after s2, 2w
Analyse sprint+1      :done,    s3t1, after s2, 1w
Sprint 4              :done,    s4, after s3, 3w
Analyse sprint+1      :done,    s4t1, after s3, 1w
Sprint 5              :active,  s5, after s4, 3w
Documentation review  :active,    s5t1, after s4, 3w

Formation             :done,    f1, 2022-02-20, 3w

Rdv Prof 1            :milestone, m1, 2022-03-15, 1d
Rdv Prof 2            :milestone, m1, 2022-03-29, 1d
Rdv Prof 3            :milestone, m1, 2022-04-19, 1d
Rdv Prof 4            :milestone, m1, 2022-05-07, 1d


section Frontend
Add user related pages        :done,    s2f1, after s1, 7w
Multilingue                   :done,    s2f2, after s1, 2w
Add entity related pages      :active,  s4f1, after s3, 6w
Add publication related pages :active,  s4f2, after s3, 6w
Add messaging related pages   :active,  s5f1, after s4, 3w
Add admin page                :active,  s5f2, after s4, 3w

section Backend
Add user API          :done,    s2b1, after s1, 4w
Auth                  :done,    s2b2, after s1, 2w
Journal de log        :done,    s3b1, after s2, 2w
Gestion des roles     :done,    s3b2, after s2, 2w
Add Admin API         :done,    s3b3, after s2, 2w
API offre/demandes    :done,    s4b1, after s3, 3w
API messaging         :done,    s4b2, after s3, 3w
API route pub         :active,  s5b1, after s4, 2w
API mail              :active,  s5b1, after s4, 3w
```
