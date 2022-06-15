# Sprint review n°3

## MVP 2

- Use case :
  - Liés aux utilisateurs (Michel)
- Diagramme de classe :
  - Utilisateur et ses liens : e.g : entité (?)
- API simpliste pour les utilisateurs (backend) : Michel - CLU - JDE : Samedi 11h 
- Interface web pour les utilisateurs (frontend) : ABA - JST
  - Page register
  - ... (a definir) ...
- Gestion roles user : TBD
- Journal de log (JST)
- Analyse (use case & co) : demandes et offres (ABA)

## Rétrospective

- Analyse (use case & co) : demandes et offres (JDE-ABA) **OK**
- Journal de log (JST)  **OK**
- API simpliste pour les utilisateurs (backend) :
    - Gestion roles user (JDE) **OK**
    - Admin routes (NM)  **OK**
    - Entity routes (CLU) **OK**
- Interface web pour les utilisateurs (frontend) : ABA - JST
  - Page register **En cours**
  - User preference **En cours**
  - ... (a definir) ...

### Reporté

- Interface web pour les utilisateurs (frontend)

## Objectif meeting 

- Discuter de ce qu'on rend 
- Discuter de la situation
- Discuter de la présentation
- Définir les prochains points (cf : analyse documents teams)

## Delivrables

- Pas d'image docker, changements uniquement sur le backend, peu intéressant à fournir sans l'implémentation coté frontend
- Document analyse : ABA 
- Document projet : JDE

## MVP3 

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
Analyse Globale       :done,  s2t3, after s1, 4w
Sprint 3              :done,  s3, after s2, 2w
Analyse sprint+1      :done,  s3t1, after s2, 1w
Sprint 4              :active,  s4, after s3, 3w
Analyse sprint+1      :active,  s4t1, after s3, 1w
Sprint 5              :         s5, after s4, 3w

Formation             :done,    f1, 2022-02-20, 3w

Rdv Prof 1            :milestone, m1, 2022-03-15, 1d
Rdv Prof 2            :milestone, m1, 2022-03-29, 1d
Rdv Prof 3            :milestone, m1, 2022-04-19, 1d
Rdv Prof 4            :milestone, m1, 2022-05-07, 1d


section Frontend
Add user related pages         :active,  s2f1, after s1, 5w
Multilingue           :done,    s2f2, after s1, 2w
Add entity related pages         :active,  s4f1, after s3, 3w

section Backend
Add user API          :done,  s2b1, after s1, 4w
Auth                  :done,    s2b2, after s1, 2w
Journal de log        :done,  s3b1, after s2, 2w
Gestion des roles     :done,  s3b2, after s2, 2w
Add Admin API         :done,  s3b3, after s2, 2w
API offre/demandes     :active,  s4b1, after s3, 3w
```