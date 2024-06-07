# How To Publish in GitHub Branch using VSCode

## For Local Repository

```git init``` for initializing a local repository

```git add .``` to add all your files that the local repository

```git commit -m ‘commit message’``` to save the changes you made to those files

## Add Remote Server to Git

```git remote add origin https://github.com/EurekaCHWARD/Montir.git``` .To change remote server, use ```git remote set-url origin https://github.com/EurekaCHWARD/Montir-App.git```

To confirm the remote has been added, `run ```git remote -v```

## How to Push a New Branch to Remote

```git branch branch-name``` To create a new branch

```git switch branch name``` To switch branch

```git push –u origin <branch name>``` To push the local repository into remote repository branch