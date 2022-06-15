# Sprint review n°2

## MVP 1

- Début d'écriture des spécifications globales de la plateforme
  - User Story
  - Diagrammes
  - etc
- Mise en place du token pour la communication frontend/backend et gestion des droits
- Page de login (frontend)
- API simpliste pour les utilisateurs (backend)
- Interface web pour les utilisateurs (frontend)
- Début de réflexion sur l'approche multilingue
- Documentation/analyse relative aux points précédents

## Rétrospective

- Swagger a corriger/améliorer pour l'auth (flag)

### Reporté

- API simpliste pour les utilisateurs (backend)
- Interface web pour les utilisateurs (frontend)

## Objectif meeting 

 - Discuter de ce qu'on rend 
    - Doc 1 : Rapport meeting (JDE)
    - Doc 2 : Analyse et co (CLU)
 - Discuter de la présentation
    - 1 video de ce qui marche déjà : page login + postman (JST)
    - Presenter analyse
      - Outils (Quarkus,...) : JST
      - Securité : JDE
      - Fonctionnelle : 
         - Traduction : ABA
         - Analyse (cf diagrams) : CLU
    - Presenter ce qui est fait & organisationnel : ABA
 - Définir les prochains points (cf : analyse documents teams)

## Prochain MVP

### Urgent : target mardi
- Use case :
  - Liés aux utilisateurs (Michel)
- Diagramme de classe :
  - Utilisateur et ses liens : e.g : entité (?)

### Normal

- API simpliste pour les utilisateurs (backend) : Michel - CLU - JDE : Samedi 11h 
- Interface web pour les utilisateurs (frontend) : ABA - JST
  - Page register
  - ... (a definir) ...
- Gestion roles user : TBD
- Journal de log (JST)
- Analyse (use case & co) : demandes et offres (ABA)

## Idées futures

- "Maintenance mode" avec message d'alerte possible

## WBS

A defnir plus précisement par les équipes sur base du MVP

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
Analyse Globale       :active,  s2t3, after s1, 4w
Sprint 3              :active,  s3, after s2, 2w
Analyse sprint+1      :active,  s3t1, after s2, 1w
Sprint 4              :         s4, after s3, 3w
Analyse sprint+1      :         s4t1, after s3, 1w
Sprint 5              :         s5, after s4, 3w

Formation             :done,    f1, 2022-02-20, 3w

Rdv Prof 1            :milestone, m1, 2022-03-15, 1d
Rdv Prof 2            :milestone, m1, 2022-03-29, 1d
Rdv Prof 3            :milestone, m1, 2022-04-19, 1d
Rdv Prof 4            :milestone, m1, 2022-05-07, 1d


section Frontend
Add user related pages         :active,  s2f1, after s1, 4w
Multilingue           :done,    s2f2, after s1, 2w

section Backend
Add user API          :active,  s2b1, after s1, 4w
Auth                  :done,    s2b2, after s1, 2w
Journal de log        :active,  s3b1, after s2, 2w
Gestion des roles     :active,  s3b1, after s2, 2w
```