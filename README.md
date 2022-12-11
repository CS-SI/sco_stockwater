# Procédure ajout series temporelles

Il est requis d'avoir nodejs installer(https://nodejs.org/en/download/)

1. Cloner le projet
2. Se rendre à la racine du projet
3. Installer les dependences avec la commande `npm install`
4. Ajouter/Editer les series CSV présentes dans le répertoire `public/series`
5. Aller dans le dossier `src/script`
6. Exécuter le script handleSeriesFiles avec la commande `node handleSeriesFiles.js`
7. Un message "DONE" ou un message d'erreur s'affichera dans le terminal quand le script sera terminé
8. Revenir a la racine du projet `cd ../../`
9. Afficher les changements avec `git status`
10. Ajouter les changements désirés `git add + < fichier désirés >`
11. Ajouter un message avec `git commit -m "< message >"`
12. Envoyer les changements sur la branch "master" `git push`
13. Deployer les changements avec la commande `npm run build-deploy`
