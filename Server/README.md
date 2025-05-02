La partie Serveur est constitué de 2 dossiers principaux:
- **BDD**: contient l'ensemble de nos données sous la forme de fichier JSON.
- **MQTT**: contient les traitements pour récupérer les informations de ZigbeeMQTT.

Afin de tester notre programme, il faut lancer le script Server/MQTT/analyseLog.js avec node. Puis intérgair avec le fichier Server/logZig.txt.
Si l'on copie-colle la dernière ligne du fichier logZig.txt dans ce même fichier, alors les fichiers JSON dans le dossier BDD seront modifié. En loccurence 
ce sera le fichier table_Module.json qui sera modifié car l'on ajoute les valeurs d'un module.