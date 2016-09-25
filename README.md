# transifex

## Dependencies

- git
- npm and nodejs

This project has been developed on Ubuntu 64-bit 16.04 with the latest version that the official package manager provides. Here are the versions of each dependency:

```
git:master on apparatus in ~ git --version
git version 2.7.4
git:master on apparatus in ~ node --version
v4.2.6
git:master on apparatus in ~ npm --version
3.5.2
```

## Installation

- `git clone git@github.com:DictumMortuum/transifex.git`
- `npm install`

## Usage

### Synopsis

`node index.js [ OPTIONS ]... ?ARG?`

Where `?ARG?` is used to specify the language code that you want to retrieve information for. This is an optional argument. If it is not provided, then all the language codes that are returned from the API are printed to standard output; in addition, the language codes are saved in a .csv file in the same folder that the script run from.

`OPTIONS` are all optional command-line switches.

### OPTIONS

#### `--path`

Specify the folder where the cached responses from the API will be stored.

Defaults to `/tmp`.

```
$ ls -l languages     
ls: cannot access 'languages': No such file or directory
$ node index.js --path . > /dev/null
$ ls -l languages                    
-rw-rw-r-- 1 dictummortuum dictummortuum 72691 Sep 25 15:32 languages
```

#### `--ttl`

Specify the amount of time in ms that the cached response stays valid for. The amount should be a positive integer.

Defaults to 10000 ms.

Querying the result of the zu_ZA language code creates a file to cache the response.

```
$ node index.js --path . zu_ZA > /dev/null
$ stat zu_ZA
  File: 'zu_ZA'
  Size: 148       	Blocks: 8          IO Block: 4096   regular file
Device: 806h/2054d	Inode: 23724060    Links: 1
Access: (0664/-rw-rw-r--)  Uid: ( 1000/dictummortuum)   Gid: ( 1000/dictummortuum)
Access: 2016-09-25 15:37:59.466818953 +0300
Modify: 2016-09-25 15:38:00.038800352 +0300
Change: 2016-09-25 15:38:00.038800352 +0300
 Birth: -
```

Querying the API for the same language code with a large TTL will return the cached response, since it is within the time frame. Notice the changed Access time.

```
$ node index.js --path . zu_ZA --ttl 200000000 > /dev/null
$ stat zu_ZA
  File: 'zu_ZA'
  Size: 148       	Blocks: 8          IO Block: 4096   regular file
Device: 806h/2054d	Inode: 23724060    Links: 1
Access: (0664/-rw-rw-r--)  Uid: ( 1000/dictummortuum)   Gid: ( 1000/dictummortuum)
Access: 2016-09-25 15:38:27.769898239 +0300
Modify: 2016-09-25 15:38:00.038800352 +0300
Change: 2016-09-25 15:38:00.038800352 +0300
 Birth: -
```

Making a final request to the API, now with zero TTL. The Access time is the same, however the Modify and Change times have been changed, as the file was overwritten with the new response.

```
$ node index.js --path . zu_ZA --ttl 0 > /dev/null  
$ stat zu_ZA                                       
  File: 'zu_ZA'
  Size: 148       	Blocks: 8          IO Block: 4096   regular file
Device: 806h/2054d	Inode: 23724060    Links: 1
Access: (0664/-rw-rw-r--)  Uid: ( 1000/dictummortuum)   Gid: ( 1000/dictummortuum)
Access: 2016-09-25 15:38:27.769898239 +0300
Modify: 2016-09-25 15:38:44.913340333 +0300
Change: 2016-09-25 15:38:44.913340333 +0300
 Birth: -
```

#### `--api`

Specify the API that the client is going to query for the language codes.

Because of the way that the request module works, it is possible to use a folder as an argument to this argument, assuming that the folder structure complies with the defined API. Here's an example:

```
$ node index.js --path . > /dev/null  
$ stat languages
  File: 'languages'
  Size: 72691     	Blocks: 144        IO Block: 4096   regular file
Device: 806h/2054d	Inode: 23724060    Links: 1
Access: (0664/-rw-rw-r--)  Uid: ( 1000/dictummortuum)   Gid: ( 1000/dictummortuum)
Access: 2016-09-25 16:07:40.341106720 +0300
Modify: 2016-09-25 16:07:40.905087076 +0300
Change: 2016-09-25 16:07:40.905087076 +0300
 Birth: -
$ rm out.csv                 
$ node index.js --api . --ttl 2000000 > /dev/null
$ stat out.csv
  File: 'out.csv'
  Size: 21500     	Blocks: 48         IO Block: 4096   regular file
Device: 806h/2054d	Inode: 23725368    Links: 1
Access: (0664/-rw-rw-r--)  Uid: ( 1000/dictummortuum)   Gid: ( 1000/dictummortuum)
Access: 2016-09-25 16:08:27.187476886 +0300
Modify: 2016-09-25 16:08:27.235475219 +0300
Change: 2016-09-25 16:08:27.235475219 +0300
 Birth: -
$ head -n 5 out.csv
rtl,pluralequation,code,name,nplurals
false,language.pluralequation,ach,Acoli,2
false,language.pluralequation,ady,Adyghe,2
false,language.pluralequation,af,Afrikaans,2
false,language.pluralequation,af_ZA,Afrikaans (South Africa),2
```

### Return value

The client returns 0 on success, and 1 if any error has been encountered during the retrieval of the data from the endpoint.

```
$ node index.js > /dev/null
$ echo $?
0
$ node index.js --api doesnotexist > /dev/null
$ echo $?
1
```
