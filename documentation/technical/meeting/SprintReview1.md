# Sprint review n°1

## MVP 0

Le premier MVP ne concerne pas vraiment la création de contenu mais plutot que tout le monde ai un environement de travail correctement établi et puisse faire démarrer l'application à vide. Chaque participant devra également comprendre les spéficiations et proposer des solutions.

Objectif du MVP

- Chaque participant possède:
  - Checkout Projet
  - IDE (IntelliJ / CodeJS)
  - JDK 17 setup (path)
  - Docker desktop

<nl>

- Chaque participant devra: 
  - Avoir pris connaissance des spécifications (si pas déjà fait)
  - Proposer des tâches / solutions pour le MVP suivant, avec analyse (partielle ou complète)

<nl> 

- Le setup des outils se fera lors du meeting de clôture du MVP 0, collectivement.

## Rétrospective

5 des 6 membres ont l'installation en place, le 6eme termine dans la journée.

## Prochain MVP

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

## WBS

A defnir plus précisement par les équipes sur base du MVP

## Schedule

```mermaid
gantt
dateFormat  YYYY-MM-DD
title Schedule

section Global
Sprint 1              :done,    s1, 2022-02-20, 1w
Sprint 2              :active,  s2, after s1, 2w
Analyse sprint 2      :active,  s2t1, after s1, 1w
Analyse sprint+1      :active,  s2t2, after s2t1, 1w
Analyse Globale       :active,  s2t3, after s1, 4w
Sprint 3              :         s3, after s2, 2w
Analyse sprint+1      :         s3t1, after s2, 1w
Sprint 4              :         s4, after s3, 3w
Analyse sprint+1      :         s4t1, after s3, 1w
Sprint 5              :         s5, after s4, 3w

Rdv Prof 1            :milestone, m1, 2022-03-15, 1d
Rdv Prof 2            :milestone, m1, 2022-03-29, 1d
Rdv Prof 3            :milestone, m1, 2022-04-19, 1d
Rdv Prof 4            :milestone, m1, 2022-05-07, 1d


section Frontend
Add user related pages         :active,  s2f1, after s1, 2w
Multilingue           :active,  s2f2, after s1, 2w

section Backend
Add user API          :active,  s2b1, after s1, 2w
Auth                  :active,  s2b2, after s1, 2w
```

## Remarques

Besoin d'une vision plus globale, d'un début d'analyse des fonctionnalités de l'application.

