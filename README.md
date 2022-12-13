# Procédure ajout series temporelles

Il est requis d'avoir nodejs installer(https://nodejs.org/en/download/)

1. Cloner le projet.
2. Se rendre à la racine du projet.
3. Se mettre sur la branche master `git checkout master`
4. Installer les dependences avec la commande `npm install`.
5. Ajouter/Editer les series CSV présentes dans le répertoire `public/series`.
6. Aller dans le dossier `src/script`.
7. Exécuter le script handleSeriesFiles avec la commande `node handleSeriesFiles.js`.
8. Un message "DONE" ou un message d'erreur s'affichera dans le terminal quand le script sera terminé.
9. Revenir a la racine du projet `cd ../../`.
10. Afficher les changements avec `git status`.
11. Ajouter les changements désirés `git add + < fichier désirés >`.
12. Ajouter un message avec `git commit -m "< message >"`.
13. Envoyer les changements sur la branch "master" `git push`.
14. Deployer les changements avec la commande `npm run build-deploy`.
15. Le message "Published" confirmera le deploiement.
