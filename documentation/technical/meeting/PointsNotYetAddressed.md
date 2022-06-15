# List of point not yet addressed

## Users and entity

- Only admins can create/remove an entity ! (what we call admin here is AC)
- Roles dedicated to the entity / user relationship (so far manager / member only) **(see with customer if acceptable)**
    - These roles can have a validity in time, can be reconducted. /!\ put in place alert near expiration.
- Users validation : nothing done so far
- Mandate to act on behalf on another user : as he could not be registered, free field text for mandate in offers / requests is enough ? **(see with customer if acceptable)**
- Review all the journal logs and ensure it's present in every operation (backend) and information are relevant
- User : ~~add phone / GSM~~, picture ?
- Entity must have their own page (similar to users). Free text description would be very useful to allow them to publish information
- ~~Setup user preferences : "hide my location", "hide my name", "hide my phone", "hide my email"~~
  - ~~Advice : do not share anything else than login (displayName) by default~~
- On the UI, insist on **term of use** (including GDPR)
  - GDPR : "droit à l'oubli" : how to implement this ? Allow account deletion ?
- On the UI, insist on **privacy** (see userPreferences). For address, maybe use google maps or other to display distances, so the exact address won't be displayed (if UserPreference address is public, then display distances, otherwise say something like 'unknown'?)

## Request and offers

- Cleanup : do not display is enough, or should move to an archive table, or completly remove ? **(see with customer)**
- Think about media in offers : video, pictures ? (in specs)
- Strategy to display offers : ranking of importance by category ?, possibility to define an offer as urgent (maybe add admin validation), others (geolocalization, ...). Maybe also allow AC to customize the strategy ? **Partially answered in analysis**

### Communication 

- Messages can be public on an offer ==> "kind of" comments
- Messages can be private for personnal info ==> in that case, do we link it to the offer, or do we set a dedicated "messaging" to allow conversation unrelated to offers ?

### Basket 

- Basket : the goal is to allow the user to group offers/demands. **Not sure I understood the point**, as the idea is to "lock" the demands, but I think it's not making sense here. If I put all the offers in my basket, that would somehow ruin the whole goal of this platform.
- Link between offers (complex) : e.g : I just displayed interest into materials, propose other materials page. (category could be a first step)


### Taxonomy 

> See below sample categories for offers / requests, just as example

1. Logement : pour une famille.
2. Évacuation : la logistique pour déplacer des occupants d’un immeuble vers un autre, éventuellement plusieurs si l’habitat est collectif.
3. Soins personnels : continuité médicamenteuse, hygiène personnelle, . . .
4. Informations actualisées sur la situation de manière contextualisée (décrue de la rivière X,
progression de l’incendie vers le village de Y, plus d’eau courante à Z, . . .).
5. Offre/demande d’emploi
6. Aide financière
7. Assistance médicale
8. Fournitures (mobilier, électroménager, vêtement, électronique (TV, GSM, Ordinateur, . . .),
moyen de locomotion 12).
9. Aide logistique (nettoyer, maçonnerie, bâcher, . . .).