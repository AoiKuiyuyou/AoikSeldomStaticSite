--- yaml | extend://meta://../_base/post_page_base_build.md

title: AoikWinWhich - which program implemented in various languages

author: Aoik

create_time: 2018-04-22 10:00:00

tags:
    - which
    - bash
    - batch
    - c
    - ceylon
    - clojure
    - coffeescript
    - cpp
    - cpp-cli
    - csharp
    - d
    - dart
    - eiffel
    - erlang
    - fsharp
    - go
    - groovy
    - haskell
    - hy
    - java
    - javascript
    - julia
    - kotlin
    - lua
    - ocaml
    - pascal
    - perl
    - php
    - python
    - ruby
    - rust
    - scala
    - scheme
    - tcl
    - vb.net
    - xtend

post_id: 1

$template:
    file: ./index_template.html

    builder: root://tools/nunjucks/nunjucks_builder.js

$output: chroot://path=./index.html&from=root://src&to=root://build

--- markdown | template | output
# AoikWinWhich - which program implemented in various languages

## AoikWinWhich-Bash
```
#!/usr/bin/env bash

function strings_has {
    #/
    local item="$1"

    #/
    local elem

    for elem in "${@:2}";
    do
        [[ "$elem" == "$item" ]] && return 0
    done

    #/
    return 1
}

function strings_uniq {
    #/ $1 is name of result variable to set on return
    local resvar="$1"

    #/ $2 upwards are array items
    shift

    local item_s=("${@}")

    #/
    local item_new_s=()

    for item in "${item_s[@]}"
    do
        strings_has "$item" "${item_new_s[@]}" || item_new_s+=("$item")
    done

    #/
    eval $resvar='( "${item_new_s[@]}" )'
}

function strings_trim()
{
    #/ $1 is name of result variable to set on return
    local resvar="$1"

    #/ $2 upwards are array items
    shift

    local item_s=("${@}")

    #/
    local item_new_s=()

    local item_new

    for item in "${item_s[@]}"
    do
        if [[ "$item" =~ ^[[:space:]]*([^[:space:]].*[^[:space:]])[[:space:]]*$ ]]
        then
            item_new="${BASH_REMATCH[1]}"
        else
            item_new="$item"
        fi
        item_new_s+=("$item_new")
    done

    #/
    eval $resvar='( "${item_new_s[@]}" )'
}

function strings_unempty()
{
    #/ $1 is name of result variable to set on return
    local resvar="$1"

    #/ $2 upwards are array items
    shift

    local item_s=("${@}")

    #/
    local item_new_s=()

    for item in "${item_s[@]}"
    do
        if [ -n "$item" ]; then
            item_new_s+=("$item")
        fi
    done

    #/
    eval $resvar='( "${item_new_s[@]}" )'
}

function strings_lower()
{
    #/ $1 is name of result variable to set on return
    local resvar="$1"

    #/ $2 upwards are array items
    shift

    local item_s=("${@}")

    #/
    local item_new_s=()

    for item in "${item_s[@]}"
    do
        item_new_s+=("${item,,}")
    done

    #/
    eval $resvar='( "${item_new_s[@]}" )'
}

function strings_anyisendof {
    #/
    local item="$1"

    #/
    local elem

    for elem in "${@:2}";
    do
        [[ "$item" == *"$elem" ]] && return 0
    done

    #/
    return 1
}

function find_executable {
    #/ $1 is name of result variable to set on return
    local resvar="$1"

    #/
    local prog="$2"

    #/ 6qhHTHF
    #/ split into a list of extensions
    OIFS="$IFS"
    IFS=';'
    [ -z "$PATHEXT" ] && ext_s=() || ext_s=( $PATHEXT )
    IFS="$OIFS"

    #/ 2pGJrMW
    #/ strip
    strings_trim ext_s "${ext_s[@]}"

    #/ 2gqeHHl
    #/ remove empty
    strings_unempty ext_s "${ext_s[@]}"

    #/ 2zdGM8W
    #/ convert to lowercase
    strings_lower ext_s "${ext_s[@]}"

    #/ 2fT8aRB
    #/ uniquify
    strings_uniq ext_s "${ext_s[@]}"

    #/ 6mPI0lg
    OIFS="$IFS"
    IFS=':'
    ## In Cygwin, |;| in PATH is converted to |:|.
    [ -z "$PATH" ] && dir_path_s=() || dir_path_s=( $PATH )
    IFS="$OIFS"

    #/ 5rT49zI
    #/ insert empty dir path to the beginning
    ##
    ## Empty dir handles the case that |prog| is a path, either relative or
    ##  absolute. See code 7rO7NIN.
    dir_path_s=( '' "${dir_path_s[@]}")

    #/ 2klTv20
    #/ uniquify
    strings_uniq dir_path_s "${dir_path_s[@]}"

    #/ 6bFwhbv
    exe_path_s=()

    for dir_path in "${dir_path_s[@]}"; do
        #/ 7rO7NIN
        #/ synthesize a path with the dir and prog
        if [ "$dir_path" == '' ]; then
            path="$prog"
        else
            path="$dir_path/$prog"
        fi

        #/ 6kZa5cq
        ## assume the path has extension, check if it is an executable
        if strings_anyisendof "$path" "${ext_s[@]}"; then
            if [ -f "$path" ]; then
                exe_path_s=( "${exe_path_s[@]}" "$path" )
            fi
        fi

        #/ 2sJhhEV
        ## assume the path has no extension
        for ext in "${ext_s[@]}"; do
            #/ 6k9X6GP
            #/ synthesize a new path with the path and the executable extension
            path_plus_ext="$path$ext"

            #/ 6kabzQg
            #/ check if it is an executable
            if [ -f "$path_plus_ext" ]; then
                exe_path_s=( "${exe_path_s[@]}" "$path_plus_ext" )
            fi
        done
    done

    #/ 8swW6Av
    #/ uniquify
    strings_uniq exe_path_s "${exe_path_s[@]}"

    #/
    eval $resvar='( "${exe_path_s[@]}" )'
}

function main {
    #/ 9mlJlKg
    if [ "$#" != "1" ]; then
        #/ 7rOUXFo
        #/ print program usage
        echo 'Usage: aoikwinwhich PROG'
        echo ''
        echo '#/ PROG can be either name or path'
        echo 'aoikwinwhich notepad.exe'
        echo 'aoikwinwhich C:\Windows\notepad.exe'
        echo ''
        echo '#/ PROG can be either absolute or relative'
        echo 'aoikwinwhich C:\Windows\notepad.exe'
        echo 'aoikwinwhich Windows\notepad.exe'
        echo ''
        echo '#/ PROG can be either with or without extension'
        echo 'aoikwinwhich notepad.exe'
        echo 'aoikwinwhich notepad'
        echo 'aoikwinwhich C:\Windows\notepad.exe'
        echo 'aoikwinwhich C:\Windows\notepad'

        #/ 3nqHnP7
        return
    fi

    #/ 9m5B08H
    #/ get name or path of a program from cmd arg
    prog="$1"

    #/ 8ulvPXM
    #/ find executables
    find_executable path_s "$prog"

    #/ 5fWrcaF
    #/ has found none, exit
    if [ "${#path_s[@]}" == "0" ]; then
        #/ 3uswpx0
        return
    fi

    #/ 9xPCWuS
    #/ has found some, output
    printf "%s\n" "${path_s[@]}"

    #/ 4s1yY1b
    return
}

main "$@"
```

## AoikWinWhich-Batch
```
@echo off
setlocal EnableDelayedExpansion

::/
call :main %*
exit /B

::/ define a |strIndex| func
::# Copied from: http://stackoverflow.com/a/22928259
::--BEG
:strIndex string substring [instance]
    REM Using adaptation of strLen function found at http://www.dostips.com/DtCodeCmdLib.php#Function.strLen

    SETLOCAL ENABLEDELAYEDEXPANSION
    SETLOCAL ENABLEEXTENSIONS
    IF "%~2" EQU "" SET Index=-1 & GOTO strIndex_end
    IF "%~3" EQU "" (SET Instance=1) ELSE (SET Instance=%~3)
    SET Index=-1
    SET String=%~1

    SET "str=A%~1"
    SET "String_Length=0"
    FOR /L %%A IN (12,-1,0) DO (
        SET /a "String_Length|=1<<%%A"
        FOR %%B IN (!String_Length!) DO IF "!str:~%%B,1!"=="" SET /a "String_Length&=~1<<%%A"
    )
    SET "sub=A%~2"
    SET "Substring_Length=0"
    FOR /L %%A IN (12,-1,0) DO (
        SET /a "Substring_Length|=1<<%%A"
        FOR %%B IN (!Substring_Length!) DO IF "!sub:~%%B,1!"=="" SET /a "Substring_Length&=~1<<%%A"
    )

    IF %Substring_Length% GTR %String_Length% GOTO strIndex_end

    SET /A Searches=%String_Length%-%Substring_Length%
    IF %Instance% GTR 0 (
        FOR /L %%n IN (0,1,%Searches%) DO (
            CALL SET StringSegment=%%String:~%%n,!Substring_Length!%%

            IF "%~2" EQU "!StringSegment!" SET /A Instance-=1
            IF !Instance! EQU 0 SET Index=%%n & GOTO strIndex_end
    )) ELSE (
        FOR /L %%n IN (%Searches%,-1,0) DO (
            CALL SET StringSegment=%%String:~%%n,!Substring_Length!%%

            IF "%~2" EQU "!StringSegment!" SET /A Instance+=1
            IF !Instance! EQU 0 SET Index=%%n & GOTO strIndex_end
    ))

:strIndex_end
    EXIT /B %Index%
::--END

:items_exists
REM %~1: items' array-like variable name prefix
REM %~2: items' count
REM %~3: item to check if it exists in the items
    ::/
    setlocal

    ::/
    set items_vnp=%~1

    ::/
    set items_cnt=%~2

    ::/
    set item=%~3

    ::/
    set /A items_imax=items_cnt-1

    for /L %%m in (0,1,!items_imax!) do (
        call set "cur_item=%%!items_vnp![%%m]%%"

        if "!item!" == "!cur_item!" (
            exit /B 0
        )
    )

    exit /B 1
goto:eof

:exts_anyisendof
REM %~1: exts' array-like variable name prefix
REM %~2: exts' count
REM %~3: path to check if it ends with one of the exts
    ::/
    setlocal

    ::/
    set exts_vnp=%~1

    ::/
    set exts_cnt=%~2

    ::/
    set path=%~3

    ::/
    set /A exts_imax=exts_cnt-1

    for /L %%x in (0,1,!exts_imax!) do (
        call set "ext=%%!exts_vnp![%%x]%%"

        ::/ check if the path ends with one of the exts
        REM :: Tried using |findstr| but very slow.
        REM --BEG
        REM set regex=.*\!ext!
        REM echo.!path!|>nul findstr /I /rx "!regex!"
        REM --END

        call :strIndex "!path!" "." -1

        set ext_dot_idx=!errorlevel!

        if ext_dot_idx neq -1 (
            call set path_ext=%%path:~!ext_dot_idx!%%

            if /I "!path_ext!"=="!ext!" (
                exit /B 0
            )
        )
    )

    exit /B 1
goto:eof

::/
:find_executable
REM %~1: prog name or path
    ::/
    setlocal

    ::/
    set prog=%~1

    ::/ 6qhHTHF
    ::/ split into a list of extensions
    set i=0

    for %%e in ("%PATHEXT:;=";"%") do (
        ::/
        set _ext=%%~e

        ::/ 2gqeHHl
        REM:: remove empty
        if not "!_ext!" == "" (
            call set "ext_s[%%i%%]=!_ext!"
            set /A i=i+1
        )
    )

    set /A exts_cnt=i

    set /A ext_imax=exts_cnt-1

    ::/ 6bFwhbv
    set i=0
    ::: loop index

    set res_path_i=0
    ::: result index

    for %%x in ("" "%PATH:;=";"%") do (
        ::/ 7rO7NIN
        REM :: synthesize a path with the dir and prog
        if "%%~x" == "" (
            if "!i!" == "0" (
                set path=%prog%
            ) else (
                ::/ ignore empty dir unless it's the first
                set path=
            )
        ) else (
            set path=%%~x\%prog%
        )

        ::/
        if not "!path!" == "" (
            ::/ 6kZa5cq
            REM :: assume the path has extension, check if it is an executable
            if exist "!path!" if not exist "!path!\" (
                ::/ check if the path ends with one of the exts
                call :exts_anyisendof "ext_s" "!exts_cnt!" "!path!"
                ::: Y
                if "!errorlevel!" == "0" (
                    ::/ check if the path exists in result
                    call :items_exists "res_path_s" "!res_path_i!" "!path!"
                    ::: N
                    if not "!errorlevel!" == "0" (
                        ::/ add to res_path_s
                        call set "res_path_s[!res_path_i!]=!path!"

                        ::/
                        set /A res_path_i=res_path_i+1
                    )
                )
            )

            ::/ 2sJhhEV
            REM :: assume the path has no extension
            for /L %%k in (0,1,%ext_imax%) do (
                ::/ 6k9X6GP
                REM :: synthesize a new path with the path and the executable extension
                set ext=!ext_s[%%k]!

                set path_plus_ext=!path!!ext!

                ::/ 6kabzQg
                REM :: check if it is an executable
                if exist "!path_plus_ext!" if not exist "!path_plus_ext!\" (
                    ::/ check if the path exists in result
                    call :items_exists "res_path_s" "!res_path_i!" "!path_plus_ext!"
                    ::: N
                    if not "!errorlevel!" == "0" (
                        ::/ add to res_path_s
                        call set "res_path_s[!res_path_i!]=!path_plus_ext!"

                        ::/
                        set /A res_path_i=res_path_i+1
                    )
                )
            )
        )

        ::/
        set /A i=i+1
    )

    ::/ 5fWrcaF
    ::/ has found none, exit
    if %res_path_i% equ 0 (
        ::/ 3uswpx0
        exit /B
    )

    ::/ 9xPCWuS
    ::/ has found some, output
    set /A res_path_imax=res_path_i-1

    for /L %%n in (0,1,%res_path_imax%) do (
        echo !res_path_s[%%n]!
    )
goto:eof

:main
    ::/
    setlocal

    ::/ 9mlJlKg
    ::/ check if one cmd arg is given
    set args_len=0
    for %%x in (%*) do set /A args_len+=1

    :: N
    if not "%args_len%" == "1" (
        ::/ 7rOUXFo
        ::/ print program usage
        echo.Usage: aoikwinwhich PROG
        echo.
        echo.#/ PROG can be either name or path
        echo.aoikwinwhich notepad.exe
        echo.aoikwinwhich C:\Windows\notepad.exe
        echo.
        echo.#/ PROG can be either absolute or relative
        echo.aoikwinwhich C:\Windows\notepad.exe
        echo.aoikwinwhich Windows\notepad.exe
        echo.
        echo.#/ PROG can be either with or without extension
        echo.aoikwinwhich notepad.exe
        echo.aoikwinwhich notepad
        echo.aoikwinwhich C:\Windows\notepad.exe
        echo.aoikwinwhich C:\Windows\notepad

        ::/ 3nqHnP7
        exit /B
    )

    ::/ 9m5B08H
    ::/ get name or path of a program from cmd arg
    set prog=%~1

    ::/ 8ulvPXM
    ::/ find executables
    call :find_executable "!prog!"

    ::/ 4s1yY1b
    exit /B

goto:eof
```

## AoikWinWhich-C
```
//
#include "stdafx.h"
#include <windows.h>
#include <Shlwapi.h>
#pragma comment(lib, "Shlwapi.lib")

//
typedef char const * String;

//
typedef struct StringNode
{
    String str;
    struct StringNode* next;
} StringNode;

//
typedef struct StringList
{
    StringNode* head;
    StringNode* end;
    size_t count;
} StringList;

//
StringNode* stringnode_create(String str) {
    //
    StringNode* str_node = (StringNode*)malloc(sizeof(StringNode));

    //
    str_node->str = str;

    str_node->next = NULL;

    //
    return str_node;
}

//
StringList* stringlist_create() {
    //
    StringList* str_list = (StringList*)malloc(sizeof(StringList));

    //
    str_list->head = NULL;
    str_list->end = NULL;
    str_list->count = 0;

    //
    return str_list;
}

//
void stringlist_add_head(StringList* str_list, String str) {
    //
    StringNode* item = stringnode_create(str);

    //if strlist->end
    if (str_list->count == 0) {
        //
        assert(!str_list->head);

        assert(!str_list->end);

        //
        str_list->head = item;

        str_list->end = item;

        // new end clears "next"
        str_list->end->next = NULL;
    }
    else {
        //
        assert(str_list->head);

        assert(str_list->end);

        // new head links to old head
        item->next = str_list->head;

        // set new head
        str_list->head = item;
    }

    //
    str_list->count += 1;
}

//
void stringlist_add_end(StringList* str_list, String str) {
    //
    StringNode* item = stringnode_create(str);

    //if strlist->end
    if (str_list->count == 0) {
        //
        assert(!str_list->head);

        assert(!str_list->end);

        //
        str_list->head = item;

        str_list->end = item;

        // new end clears "next"
        str_list->end->next = NULL;
    }
    else {
        //
        assert(str_list->head);

        assert(str_list->end);

        // old end links to new end
        str_list->end->next = item;

        // set new end
        str_list->end = item;

        // new end clears "next"
        str_list->end->next = NULL;
    }

    //
    str_list->count += 1;
}

//
BOOL stringlist_contains(StringList* str_list, String str) {
    //
    StringNode* node = str_list->head;

    while (node) {
        // If two strings are equal
        if (!strcmp(node->str, str)) {
            return TRUE;
        };

        //
        node = node->next;
    }

    return FALSE;
}

//
void stringlist_uniq(
    StringList* res_list, // Result
    StringList* str_list)
{
    //
    StringNode* node = str_list->head;

    while (node) {
        //
        if (!stringlist_contains(res_list, node->str)) {
            // String "node->str" is changed ownership
            stringlist_add_end(res_list, node->str);

            // Clear old pointer
            node->str = NULL;
        };

        //
        node = node->next;
    }
}

//
void stringlist_del(StringList* str_list) {
    //
    StringNode* node = str_list->head;

    while (node) {
        //
        StringNode* next = node->next;

        //
        if (node->str) {
            //
            free((void*)node->str);

            //
            node->str = NULL;
        }

        node->next = NULL;

        free(node);

        //
        node = next;
    }

    //
    str_list->head = NULL;

    str_list->end = NULL;

    str_list->count = 0;

    //
    free(str_list);
}

//
void stringlist_del_v2(
    StringList** str_list_pp // "pp" means pointer pointer
    ) {
    //
    assert(str_list_pp);

    assert(*str_list_pp);

    //
    stringlist_del(*str_list_pp);

    // Set the "StringList pointer" to NULL, in order to avoid address violation.
    *str_list_pp = NULL;
}

//
char* string_copy_new(const char* str) {
    //
    size_t str_bytes_cnt = sizeof(char) * (strlen(str) + 1);

    //
    char* str_copy = (char *)malloc(str_bytes_cnt);

    //
    memcpy(str_copy, str, str_bytes_cnt);

    str_copy[str_bytes_cnt - 1] = '\0';

    //
    return str_copy;
}

//
void string_split(StringList* str_s, String str, char sep) {
    //
    char sep_str[2];

    sep_str[0] = sep;
    sep_str[1] = '\0';

    //
    size_t str_len = strlen(str);

    size_t start = 0;

    while (TRUE) {
        //
        String substr_start = str + start;

        // 2a1XF8a
        // Can be 0 when the first char is the sep char.
        size_t substr_cnt = strcspn(substr_start, sep_str);

        // "+ 1" for null terminator.
        //
        // "substr_cnt" at 2a1XF8a being 0 is well handled.
        size_t substr_byte_cnt = sizeof(char) * (substr_cnt + 1);

        //
        char* substr = malloc(substr_byte_cnt);

        // "substr_cnt" at 2a1XF8a being 0 is well handled.
        memcpy(substr, substr_start, substr_cnt);

        substr[substr_cnt] = '\0';

        //
        stringlist_add_end(str_s, substr);

        // "+ 1" for skipping the sep char that stops "strcspn" at 2a1XF8a.
        //
        // If what stops "strcspn" at 2a1XF8a is null char, then "start" should
        // equal (str_len + 1). This is well handled at 7fkzkrk.
        start += (substr_cnt + 1);

        // 7fkzkrk
        if (start > str_len) {
            //
            assert(start == (str_len + 1));

            //
            break;
        }
        // This is the case when the last char is the sep char
        else if (start == str_len) {
            //
            assert(str[str_len - 1] == sep);

            // Allocate an empty string
            char* empty_str = malloc(sizeof(char));

            empty_str[0] = '\0';

            // Add the last empty string.
            // E.g. string_split("a|b|", '|') -> ["a", "b", ""]
            stringlist_add_end(str_s, empty_str);

            //
            break;
        }
    }
}

//
void string_strip(char *str) {
    //
    char *end;

    // Remove heading spaces.
    //
    // Null char is well handled by "isspace".
    while (isspace(*str)) {
        str++;
    }

    //
    if (*str == '\0') {
        return;
    }

    // Remove ending spaces
    end = str + strlen(str) - 1;

    while (end > str && isspace(*end)) {
        end--;
    }

    // Set null
    *(end + 1) = '\0';
}

//
void string_tolower(char* str) {
    //
    size_t i = 0;

    for (i = 0; str[i]; i++) {
        str[i] = tolower(str[i]);
    }
}

//
char* string_concat_new(const char* str, const char* end) {
    //
    int str_len = strlen(str);

    int end_len = strlen(end);

    //
    size_t bytes_cnt = sizeof(char) * (str_len + end_len + 1);

    //
    char* str_new = (char *)malloc(bytes_cnt);

    //
    memcpy(str_new, str, str_len);

    memcpy(str_new + str_len, end, end_len);

    // Set last bytes to NUL
    str_new[str_len + end_len] = '\0';

    //
    return str_new;
}

//
BOOL string_endswith(const char* str, const char* end) {
    //
    int str_len = strlen(str);

    int end_len = strlen(end);

    //
    return
        // "str" is not shorter then "end"
        (str_len >= end_len) &&
        // Two strings' ends are equal
        (!strcmp(str + str_len - end_len, end));
}

//
BOOL prog_has_ext_in(String prog, StringList* ext_s) {
    //
    StringNode* node = ext_s->head;

    while (node) {
        // If two strings are equal
        if (string_endswith(prog, node->str)) {
            return TRUE;
        };

        //
        node = node->next;
    }

    return FALSE;
}

//
BOOL file_exists(LPCTSTR szPath) {
    DWORD dwAttrib = GetFileAttributes(szPath);

    return (dwAttrib != INVALID_FILE_ATTRIBUTES &&
        !(dwAttrib & FILE_ATTRIBUTE_DIRECTORY));
}

//
StringList* find_exe_paths(String prog)
{
    // An environment variable has a maximum size limit of 32,767 characters,
    // including the null-terminating character.
    char buf[32767];

    // 8f1kRCu
    DWORD res = GetEnvironmentVariable(TEXT("PATHEXT"), buf, 32767);

    // 4fpQ2RB
    // If "res" indicates error
    if (res == 0) {
        return NULL;
    }

    // 6qhHTHF
    // Split into a list of extensions
    //
    // Freed at 9nopWXf
    StringList* ext_s = stringlist_create();

    string_split(ext_s, buf, ';');

    //
    StringNode* node;

    // 2pGJrMW
    // Strip
    node = ext_s->head;

    while (node) {
        // String "node->str" is changed in-place
        string_strip((char *)node->str);

        //
        node = node->next;
    }

    // 2gqeHHl
    // Remove empty.
    // Must be done after the stripping at 2pGJrMW.
    //
    // Freed at 3vUw4d9
    StringList* ext_s_2 = stringlist_create();

    node = ext_s->head;

    while (node) {
        // If is not empty string
        if (node->str[0]) {
            // String "node->str" is changed ownership
            stringlist_add_end(ext_s_2, node->str);

            // Clear old pointer
            node->str = NULL;
        };

        //
        node = node->next;
    }

    // 9nopWXf
    stringlist_del_v2(&ext_s);

    assert(!ext_s);

    // 2zdGM8W
    // Convert to lowercase
    node = ext_s_2->head;

    while (node) {
        // String "node->str" is changed in-place
        string_tolower((char *)node->str);

        //
        node = node->next;
    }

    // 2fT8aRB
    // Uniquify
    //
    // Freed at 6b8UxoC
    StringList* ext_s_3 = stringlist_create();

    stringlist_uniq(ext_s_3, ext_s_2);

    // 3vUw4d9
    stringlist_del_v2(&ext_s_2);

    assert(!ext_s_2);

    //
    StringList* dir_path_s = stringlist_create();

    // 4ysaQVN
    res = GetEnvironmentVariable(TEXT("PATH"), buf, sizeof buf);

    // 5gGwKZL
    // If "res" indicates error
    if (res == 0) {
        // 7bVmOKe
        // Go ahead with "dir_path_s" being empty
        ;
    }
    else {
        // 6mPI0lg
        // Split into a list of dir paths
        string_split(dir_path_s, buf, ';');
    }

    // 5rT49zI
    // Insert empty dir path to the beginning.
    //
    // Empty dir handles the case that "prog" is a path, either relative or
    // absolute. See code 7rO7NIN.
    stringlist_add_head(dir_path_s, string_copy_new(""));

    // 2klTv20
    // Uniquify
    //
    // Freed at 6f2j5cZ
    StringList* dir_path_s_2 = stringlist_create();

    stringlist_uniq(dir_path_s_2, dir_path_s);

    // 6f2j5cZ
    stringlist_del_v2(&dir_path_s);

    assert(!dir_path_s);

    // 9gTU1rI
    // Check if "prog" ends with one of the file extension in "ext_s".
    //
    // "ext_s_3" are all in lowercase, ensured at 2zdGM8W.
    //
    // Freed at 2aR7zCp
    char* prog_lc = string_copy_new(prog);

    string_tolower(prog_lc);

    BOOL prog_has_ext = prog_has_ext_in(prog_lc, ext_s_3);

    // 2aR7zCp
    free(prog_lc);

    // 6bFwhbv
    //
    // Freed at 8swW6Av
    StringList* exe_path_s = stringlist_create();

    node = dir_path_s_2->head;

    while (node) {
        // 7rO7NIN
        // Synthesize a path
        String dir_path = node->str;

        String path = NULL;

        // If dir path is empty string
        if (!dir_path[0]) {
            path = prog;
        }
        else {
            // "PathCombine" will not writes more than MAX_PATH chars to "buf"
            assert(sizeof buf >= MAX_PATH);

            LPTSTR res = PathCombine(buf, dir_path, prog);

            // If "res" indicates error
            if (res == NULL) {
                // Ignore
                continue;
            }

            //
            path = buf;
        }

        // 6kZa5cq
        // If "prog" ends with executable file extension
        if (prog_has_ext) {
            // 3whKebE
            if (file_exists(path)) {
                // 2ffmxRF
                stringlist_add_end(exe_path_s, string_copy_new(path));
            }
        }

        // 2sJhhEV
        // Assume user has omitted the file extension
        StringNode* ext_node = ext_s_3->head;

        while (ext_node) {
            // 6k9X6GP
            // Synthesize a path with one of the file extensions in PATHEXT
            //
            // Freed at 4vT1o9M, or changed ownership at 7dui4cD
            char* path_2 = string_concat_new(path, ext_node->str);

            // 6kabzQg
            if (file_exists(path_2)) {
                // 7dui4cD
                // "path_2" is changed ownership
                stringlist_add_end(exe_path_s, path_2);
            }
            else {
                // 4vT1o9M
                free(path_2);
            }

            //
            ext_node = ext_node->next;
        }

        //
        node = node->next;
    }

    // 6b8UxoC
    stringlist_del_v2(&ext_s_3);

    assert(!ext_s_3);

    // 8swW6Av
    // Uniquify
    StringList* exe_path_s_2 = stringlist_create();

    stringlist_uniq(exe_path_s_2, exe_path_s);

    stringlist_del_v2(&exe_path_s);

    assert(!exe_path_s);

    // 7y3JlnS
    return exe_path_s_2;
};

// 4zKrqsC
// Program entry
int main(int argc, char* argv[])
{
    //
    int exit_code = 0;

    // 9mlJlKg
    // If not exactly one command argument is given
    if (argc != 2) {
        // 7rOUXFo
        // Print program usage
        char const * const usage_txt = "Usage: aoikwinwhich PROG\n"
            "\n"
            "#/ PROG can be either name or path\n"
            "aoikwinwhich notepad.exe\n"
            "aoikwinwhich C:\\Windows\\notepad.exe\n"
            "\n"
            "#/ PROG can be either absolute or relative\n"
            "aoikwinwhich C:\\Windows\\notepad.exe\n"
            "aoikwinwhich Windows\\notepad.exe\n"
            "\n"
            "#/ PROG can be either with or without extension\n"
            "aoikwinwhich notepad.exe\n"
            "aoikwinwhich notepad\n"
            "aoikwinwhich C:\\Windows\\notepad.exe\n"
            "aoikwinwhich C:\\Windows\\notepad";

        printf("%s", usage_txt);

        // 3nqHnP7
        exit_code = 1;

        return exit_code;
    }

    //
    assert(argc == 2);

    // 9m5B08H
    // Get executable name or path
    String prog = argv[1];

    // 8ulvPXM
    // Find executable paths
    //
    // Freed at 2jUVFP0
    StringList* exe_path_s = find_exe_paths(prog);

    // 5fWrcaF
    // If has found none
    if (!exe_path_s || !exe_path_s->count) {
        // 3uswpx0
        exit_code = 2;
    }
    // If has found some
    else {
        // 9xPCWuS
        // Print result
        StringNode* node = exe_path_s->head;

        while (node) {
            //
            printf("%s\n", node->str);

            //
            node = node->next;
        }

        // 4s1yY1b
        exit_code = 0;
    }

    // 2jUVFP0
    if (exe_path_s) {
        stringlist_del_v2(&exe_path_s);

        assert(!exe_path_s);
    }

    //
    return exit_code;
}
```

## AoikWinWhich-Ceylon
```
//
import ceylon.collection { LinkedList }
import java.io { File }
import java.lang { System }
import java.nio.file { Files, Paths }

shared object aoikWinWhich {
    
    shared {String*} uniq({String*} item_s) {
        value item_s_new = LinkedList<String>();
        
        for (item in item_s) {
            if (!(item in item_s_new)) {
                item_s_new.add(item);
            }
        }
        
        return item_s_new;
    }
    
    shared {String*} find_executable(String prog) {
        // 8f1kRCu
        value env_var_PATHEXT = System.getenv("PATHEXT") else "";
        
        // 6qhHTHF
        // split into a list of extensions
        variable {String*} ext_s = (env_var_PATHEXT == "")
            then {}    
            else env_var_PATHEXT.split((x) => x == (File.pathSeparator[0] else ';'));
        
        // 2pGJrMW
        // strip
        ext_s = ext_s.map((x) => x.trim(' '.equals));

        // 2gqeHHl
        // remove empty
        ext_s = ext_s.filter((x) => x != "");
        
        // 2zdGM8W
        // convert to lowercase
        ext_s = ext_s.map((x) => x.lowercased);
        
        // 2fT8aRB
        // uniquify
        ext_s = uniq(ext_s);
        
        value ext_s2 = LinkedList<String>(ext_s);

        // 4ysaQVN
        value env_var_PATH = System.getenv("PATH") else "";
        
        // 6mPI0lg
        variable LinkedList<String> dir_path_s = (env_var_PATH == "")
            then LinkedList<String>()
            else LinkedList<String>(env_var_PATH.split((x) => x == (File.pathSeparator[0] else ';')));

        // 5rT49zI
        // insert empty dir path to the beginning
        //
        // Empty dir handles the case that |prog| is a path, either relative or
        //  absolute. See code 7rO7NIN.
        dir_path_s.insert(0, "");
        
        // 2klTv20
        // uniquify
        dir_path_s = LinkedList<String>(uniq(dir_path_s));
        
        //
        value prog_lc = prog.lowercased;
        
        value prog_has_ext = ext_s2.any((ext) => prog_lc.endsWith(ext));
        
        // 6bFwhbv
        value exe_path_s = LinkedList<String>();
        
        for (dir_path in dir_path_s) {
            // 7rO7NIN
            // synthesize a path with the dir and prog
            value path = (dir_path == "")
                then prog
                else Paths.get(dir_path, prog).string;
            
            // 6kZa5cq
            // assume the path has extension, check if it is an executable
            if (prog_has_ext && Files.isRegularFile(Paths.get(path))) {
                 exe_path_s.add(path);
            }
            
            // 2sJhhEV
            // assume the path has no extension
            for (ext in ext_s) {
                // 6k9X6GP
                // synthesize a new path with the path and the executable extension
                value path_plus_ext = path + ext;

                // 6kabzQg
                // check if it is an executable
                if (Files.isRegularFile(Paths.get(path_plus_ext))) {
                    exe_path_s.add(path_plus_ext);
                }
            }
        }
        
        // 8swW6Av
        // uniquify
        value exe_path_s2 = uniq(exe_path_s);
        
        //
        return exe_path_s2;
    }
    
    shared void main() {
        // 9mlJlKg
        // check if one cmd arg is given
        if (process.arguments.size != 1) {
            // 7rOUXFo
            // print program usage
            print("Usage: aoikwinwhich PROG");
            print("");
            print("#/ PROG can be either name or path");
            print("aoikwinwhich notepad.exe");
            print("aoikwinwhich C:\\Windows\\notepad.exe");
            print("");
            print("#/ PROG can be either absolute or relative");
            print("aoikwinwhich C:\\Windows\\notepad.exe");
            print("aoikwinwhich Windows\\notepad.exe");
            print("");
            print("#/ PROG can be either with or without extension");
            print("aoikwinwhich notepad.exe");
            print("aoikwinwhich notepad");
            print("aoikwinwhich C:\\Windows\\notepad.exe");
            print("aoikwinwhich C:\\Windows\\notepad");

            // 3nqHnP7
            return;
        }
        
        // 9m5B08H
        // get name or path of a program from cmd arg
        value prog = process.arguments[0] else "";
        
        // 8ulvPXM
        // find executables
        value path_s = find_executable(prog);

        // 5fWrcaF
        // has found none, exit
        if (path_s.size == 0) {
            // 3uswpx0
            return;
        }
        
        // 9xPCWuS
        // has found some, output
        value txt = "\n".join(path_s);
        
        print(txt);
        
        // 4s1yY1b
        return;
    }
}

// define a toplevel method |aoikwinwhich::main|
shared void main() {
    aoikWinWhich.main();
}
```

## AoikWinWhich-Clojure
```
;;
(ns aoikwinwhich)

(require '[clojure.string :refer [join]])
(require '[clojure.string :refer [split]])
(import java.io.File)
(import java.lang.System)
(import java.nio.file.Files)
(import java.nio.file.LinkOption)
(import java.nio.file.Paths)
(import java.util.LinkedList)

;;
(defn -path_make
[part_s]
    (.toString (Paths/get "" (into-array part_s)))
)

(defn -file_exists
[path]
    (Files/isRegularFile (Paths/get "" (into-array [path])) (make-array LinkOption 0))
)

(defn -find_executable
[prog]
    (let [
        ;; 8f1kRCu
        env_var_PATHEXT (. System getenv "PATHEXT")
        ;;; can be nil

        ;; 4ysaQVN
        env_var_PATH (. System getenv "PATH")
        ;;; can be nil

        val_sep_re (re-pattern File/pathSeparator)
        ]

        ;;
        (let [
            ext_s
                ;; 2fT8aRB
                ;; uniquify
                (distinct
                    ;; 2zdGM8W
                    ;; convert to lowercase
                    (map #(.toLowerCase %1)
                        ;; 2gqeHHl
                        ;; remove empty
                        (filter #(not (= %1 ""))
                            ;; 2pGJrMW
                            ;; strip
                            (map #(.trim %1)
                                ;; 6qhHTHF
                                ;; split into a list of extensions
                                (if (nil? env_var_PATHEXT)
                                    ([])
                                    (split env_var_PATHEXT val_sep_re)
                                )
                            )
                        )
                    )
                )
            ]

            ;;
            (let [
                dir_path_s
                    ;; 2klTv20
                    ;; uniquify
                    (distinct
                        ;; 5rT49zI
                        ;; insert empty dir path to the beginning
                        ;;
                        ;; Empty dir handles the case that |prog| is a path, either relative or
                        ;;  absolute. See code 7rO7NIN.
                        (into [""]
                            ;; 6mPI0lg
                            (if (nil? env_var_PATH)
                                ([])
                                (split env_var_PATH val_sep_re)
                            )
                        )
                    )
                ]

                ;; 6bFwhbv
                (let [
                    exe_path_s (LinkedList.)
                    prog_lower (.toLowerCase prog)
                    prog_has_ext
                        (some #(. prog_lower endsWith %1) ext_s)
                    ]
                    (doseq [dir_path dir_path_s]
                        ;; 7rO7NIN
                        ;; synthesize a path with the dir and prog
                        (let [
                            path
                                (if (= dir_path "")
                                    prog
                                    (-path_make [dir_path prog])
                                )

                            ]

                            ;; 6kZa5cq
                            ;; assume the path has extension, check if it is an executable
                            (if (and prog_has_ext (-file_exists path))
                                (. exe_path_s add path)
                                ()
                            )

                            ;; 2sJhhEV
                            ;; assume the path has no extension
                            (doseq [ext ext_s]
                                ;; 6k9X6GP
                                ;; synthesize a new path with the path and the executable extension
                                (let [
                                    path_plus_ext (str path ext)
                                    ]

                                    ;; 6kabzQg
                                    ;; check if it is an executable
                                    (if (-file_exists path_plus_ext)
                                        (. exe_path_s add path_plus_ext)
                                        ()
                                    )
                                )
                            )
                        )
                    )

                    ;; func res
                    exe_path_s
                )
            )
        )
    )
)

(defn -main
[]
;; 9mlJlKg
;; check if one cmd arg is given
    (if (not (= 1 (count *command-line-args*)))
        (do
            ;; 7rOUXFo
            ;; print program usage
            (println "Usage: aoikwinwhich PROG")
            (println "")
            (println "#/ PROG can be either name or path")
            (println "aoikwinwhich notepad.exe")
            (println "aoikwinwhich C:\\Windows\\notepad.exe")
            (println "")
            (println "#/ PROG can be either absolute or relative")
            (println "aoikwinwhich C:\\Windows\\notepad.exe")
            (println "aoikwinwhich Windows\\notepad.exe")
            (println "")
            (println "#/ PROG can be either with or without extension")
            (println "aoikwinwhich notepad.exe")
            (println "aoikwinwhich notepad")
            (println "aoikwinwhich C:\\Windows\\notepad.exe")
            (println "aoikwinwhich C:\\Windows\\notepad")

            ;; 3nqHnP7
            ()
        )
        (do
            ;; 9m5B08H
            ;; get name or path of a program from cmd arg
            (let [prog (nth *command-line-args* 0)]
                ;; 8ulvPXM
                ;; find executables
                (let [path_s (-find_executable prog)]
                    (if (= (.size path_s) 0)
                        ;; 5fWrcaF
                        ;; has found none, exit
                        ;; 3uswpx0
                        ()

                        ;; 9xPCWuS
                        ;; has found some, output
                        (do
                            (println (join "\n" path_s))

                            ;; 4s1yY1b
                            ()
                        )
                    )
                )
            )
        )
    )
)

(-main)
```

## AoikWinWhich-CoffeeScript
```
#/
'use strict'

#/
_fs = require 'fs'
_path = require 'path'
_ = require 'underscore'

#/ add func |endsWith| to String
String::endsWith ?= (s) -> s == '' or @slice(-s.length) == s

#/
is_file = (path) ->
    fstat = null
    try
        fstat = _fs.statSync(path)
    catch err
        return false

    return fstat && fstat.isFile()

find_executable = (prog) ->
    #/ 8f1kRCu
    env_var_PATHEXT = process.env.PATHEXT
    ## can be |undefined|

    #/ 6qhHTHF
    #/ split into a list of extensions
    ext_s = if !env_var_PATHEXT \
        then []
        else env_var_PATHEXT.split(_path.delimiter)

    #/ 2pGJrMW
    #/ strip
    ext_s = (ext.trim() for ext in ext_s)

    #/ 2gqeHHl
    #/ remove empty
    ext_s = (ext for ext in ext_s when ext != '')

    #/ 2zdGM8W
    #/ convert to lowercase
    ext_s = (ext.toLowerCase() for ext in ext_s)

    #/ 2fT8aRB
    #/ uniquify
    ext_s = _.uniq(ext_s)

    #/ 4ysaQVN
    env_var_PATH = process.env.PATH
    #// can be |undefined|
    #//
    #// if has value, there is an ending || in it,
    #//  which results in an ending empty string for the splitting at 3zVznlK

    #/ 6mPI0lg
    dir_path_s = if !env_var_PATH \
        then []
        else env_var_PATH.split(_path.delimiter)
        ## 3zVznlK

    #/ 5rT49zI
    #/ insert empty dir path to the beginning
    #/
    #/ Empty dir handles the case that |prog| is a path, either relative or absolute.
    #/ See code 7rO7NIN.
    dir_path_s.unshift('')

    #/ 2klTv20
    #/ uniquify
    dir_path_s = _.uniq(dir_path_s)

    #/ 6bFwhbv
    exe_path_s = []

    _.each(dir_path_s, (dir_path) ->
        #/ 7rO7NIN
        #/ synthesize a path with the dir and prog
        path = _path.join(dir_path, prog)

        #/ 6kZa5cq
        #/ assume the path has extension, check if it is an executable
        if _.any(ext_s, (ext) -> path.endsWith(ext))
            if is_file(path)
                exe_path_s.push(path)

        #/ 2sJhhEV
        #/ assume the path has no extension
        _.each(ext_s, (ext) ->
            #/ 6k9X6GP
            #/ synthesize a new path with the path and the executable extension
            path_plus_ext = path + ext

            #/ 6kabzQg
            #/ check if it is an executable
            if is_file(path_plus_ext)
                exe_path_s.push(path_plus_ext)
        )
    )

    #/ 8swW6Av
    #/ uniquify
    exe_path_s = _.uniq(exe_path_s)

    #/
    return exe_path_s

println = (txt) ->
    process.stdout.write(txt + '\n')

main = ->
    #/ 9mlJlKg
    #/ check if one cmd arg is given
    arg_s = process.argv.slice(2)

    if arg_s.length != 1
        #/ 7rOUXFo
        #/ print program usage
        println 'Usage: aoikwinwhich PROG'
        println ''
        println '#/ PROG can be either name or path'
        println 'aoikwinwhich notepad.exe'
        println 'aoikwinwhich C:\\Windows\\notepad.exe'
        println ''
        println '#/ PROG can be either absolute or relative'
        println 'aoikwinwhich C:\\Windows\\notepad.exe'
        println 'aoikwinwhich Windows\\notepad.exe'
        println ''
        println '#/ PROG can be either with or without extension'
        println 'aoikwinwhich notepad.exe'
        println 'aoikwinwhich notepad'
        println 'aoikwinwhich C:\\Windows\\notepad.exe'
        println 'aoikwinwhich C:\\Windows\\notepad'

        #/ 3nqHnP7
        return

    #/ 9m5B08H
    #/ get name or path of a program from cmd arg
    prog = arg_s[0]

    #/ 8ulvPXM
    #/ find executables
    path_s = find_executable(prog)

    #/ 5fWrcaF
    #/ has found none, exit
    if !path_s.length
        #/ 3uswpx0
        return

    #/ 9xPCWuS
    #/ has found some, output
    txt = path_s.join('\n')

    println txt

    #/ 4s1yY1b
    return

#/
exports.main = main

#/
if require.main == module
    main()
```

## AoikWinWhich-Cpp
```
//
#include "stdafx.h"
#include <iostream>
#include <string>
#include <list>
#include <set>
#include <algorithm>
#include <windows.h>
#include <Shlwapi.h>
#pragma comment(lib, "Shlwapi.lib")

//
using namespace std;

//
#ifdef _UNICODE
#define WA_COUT wcout
#define WA_STRING wstring
#else
#define WA_COUT cout
#define WA_STRING string
#endif

// Modified from http://stackoverflow.com/questions/236129/split-a-string-in-c/7408245#7408245
// --- BEG
void string_split(list<WA_STRING> &tokens, const WA_STRING &text, char sep) {
    int start = 0, end = 0;
    while ((end = text.find(sep, start)) != WA_STRING::npos) {
        tokens.push_back(text.substr(start, end - start));
        start = end + 1;
    }
    tokens.push_back(text.substr(start));
}
// --- END

// Modified from http://stackoverflow.com/questions/216823/whats-the-best-way-to-trim-stdstring/15649849#15649849
// --- BEG
WA_STRING string_strip(const WA_STRING& s) {
    const WA_STRING& chars = TEXT(" ");
    size_t begin = 0;
    size_t end = s.size() - 1;
    for (; begin < s.size(); begin++)
        if (chars.find_first_of(s[begin]) == WA_STRING::npos)
            break;
    for (; end > begin; end--)
        if (chars.find_first_of(s[end]) == WA_STRING::npos)
            break;
    return s.substr(begin, end - begin + 1);
}
// --- END

//
WA_STRING string_tolower(WA_STRING str) {
    std::transform(str.begin(), str.end(), str.begin(), ::tolower);
    return str;
}

// Modified from http://stackoverflow.com/questions/874134/find-if-string-endswith-another-string-in-c/874160#874160
BOOL string_endswith(WA_STRING const &str, WA_STRING const &end) {
    if (str.length() >= end.length()) {
        return (0 == str.compare(str.length() - end.length(), end.length(), end));
    }
    else {
        return false;
    }
}

//
void list_strip(list<WA_STRING>& item_s) {
    std::transform(item_s.begin(), item_s.end(), item_s.begin(), string_strip);
}

//
void list_remove_empty(list<WA_STRING>& item_s) {
    list<WA_STRING>::iterator iter = item_s.begin();

    while (iter != item_s.end()) {
        // if current item is empty string
        if (*iter == TEXT("")) {
            iter = item_s.erase(iter);
        }
        else {
            ++iter;
        }
    }
}

//
void list_tolower(list<WA_STRING>& item_s) {
    std::transform(item_s.begin(), item_s.end(), item_s.begin(), string_tolower);
}

// Modified from http://stackoverflow.com/questions/4885676/remove-duplicates-from-a-listint/4885787#4885787
// --- BEG
void list_uniq(list<WA_STRING>& item_s) {
    list<WA_STRING>::iterator iter = item_s.begin();

    set<WA_STRING> item_s_met;

    while (iter != item_s.end()) {
        // if current item has been met before
        if (item_s_met.find(*iter) != item_s_met.end()) {
            iter = item_s.erase(iter);
        }
        else {
            item_s_met.insert(*iter);
            ++iter;
        }
    }
}
// --- END

//
BOOL prog_has_ext_in(WA_STRING prog, list<WA_STRING> ext_s) {
    for (list<WA_STRING>::const_iterator iter = ext_s.begin(); iter != ext_s.end(); ++iter) {
        if (string_endswith(prog, *iter)) {
            return true;
        }
    }
    return false;
}

//
BOOL file_exists(LPCTSTR szPath) {
    DWORD dwAttrib = GetFileAttributes(szPath);

    return (dwAttrib != INVALID_FILE_ATTRIBUTES &&
        !(dwAttrib & FILE_ATTRIBUTE_DIRECTORY));
}

//
list<WA_STRING>* find_exe_paths(LPCTSTR prog) {
    // An environment variable has a maximum size limit of 32,767 characters,
    // including the null-terminating character.
    TCHAR buf[32767];

    // 8f1kRCu
    DWORD res = GetEnvironmentVariable(TEXT("PATHEXT"), buf, 32767);

    // 4fpQ2RB
    // If "res" indicates error
    if (res == 0) {
        return NULL;
    }

    // 6qhHTHF
    // Split into a list of extensions
    list<WA_STRING> ext_s;

    WA_STRING env_pathext(buf);

    string_split(ext_s, env_pathext, ';');

    // 2pGJrMW
    // Strip
    list_strip(ext_s);

    // 2gqeHHl
    // Remove empty.
    // Must be done after the stripping at 2pGJrMW.
    list_remove_empty(ext_s);

    // 2zdGM8W
    // Convert to lowercase
    list_tolower(ext_s);

    // 2fT8aRB
    // Uniquify
    list_uniq(ext_s);

    //
    list<WA_STRING> dir_path_s;

    // 4ysaQVN
    res = GetEnvironmentVariable(TEXT("PATH"), buf, sizeof buf);

    // 5gGwKZL
    // If "res" indicates error
    if (res == 0) {
        // 7bVmOKe
        // Go ahead with "dir_path_s" being empty
        ;
    }
    else {
        // 6mPI0lg
        // Split into a list of dir paths
        WA_STRING env_path(buf);

        string_split(dir_path_s, env_path, ';');
    }

    // 5rT49zI
    // Insert empty dir path to the beginning.
    //
    // Empty dir handles the case that "prog" is a path, either relative or
    // absolute. See code 7rO7NIN.
    dir_path_s.push_front(TEXT(""));

    // 2klTv20
    // Uniquify
    list_uniq(dir_path_s);

    // 9gTU1rI
    // Check if "prog" ends with one of the file extension in "ext_s".
    //
    // "ext_s" are all in lowercase, ensured at 2zdGM8W.
    BOOL prog_has_ext = prog_has_ext_in(string_tolower(prog), ext_s);

    // 6bFwhbv
    list<WA_STRING> *exe_path_s = new list<WA_STRING>();

    for (list<WA_STRING>::const_iterator iter = dir_path_s.begin(); iter != dir_path_s.end(); ++iter) {
        // 7rO7NIN
        // Synthesize a path
        WA_STRING dir_path = *iter;

        WA_STRING path;

        // If dir path is empty string
        if (dir_path == TEXT("")) {
            path = WA_STRING(prog);
        }
        else {
            // "PathCombine" will not writes more than MAX_PATH chars to "buf"
            assert(sizeof buf >= MAX_PATH);

            LPTSTR res = PathCombine(buf, dir_path.c_str(), prog);

            // If "res" indicates error
            if (res == NULL) {
                // Ignore
                continue;
            }

            //
            path = WA_STRING(buf);
        }

        // 6kZa5cq
        // If "prog" ends with executable file extension
        if (prog_has_ext) {
            // 3whKebE
            if (file_exists(path.c_str())) {
                // 2ffmxRF
                exe_path_s->push_back(path);
            }
        }

        // 2sJhhEV
        // Assume user has omitted the file extension
        for (list<WA_STRING>::const_iterator iter = ext_s.begin(); iter != ext_s.end(); ++iter) {
            // 6k9X6GP
            // Synthesize a path with one of the file extensions in PATHEXT
            WA_STRING ext = *iter;

            WA_STRING path_2 = path + ext;

            // 6kabzQg
            if (file_exists(path_2.c_str())) {
                exe_path_s->push_back(path_2);
            }
        }
    }

    // 8swW6Av
    // Uniquify
    list_uniq(*exe_path_s);

    // 7y3JlnS
    return exe_path_s;
}

// 4zKrqsC
// Program entry
int _tmain(int argc, _TCHAR* argv[])
{
    //
    int exit_code = 0;

    // 9mlJlKg
    // If not exactly one command argument is given
    if (argc != 2) {
        // 7rOUXFo
        // print program usage
        string usage_txt = "Usage: aoikwinwhich PROG\n"
            "\n"
            "#/ PROG can be either name or path\n"
            "aoikwinwhich notepad.exe\n"
            "aoikwinwhich C:\\Windows\\notepad.exe\n"
            "\n"
            "#/ PROG can be either absolute or relative\n"
            "aoikwinwhich C:\\Windows\\notepad.exe\n"
            "aoikwinwhich Windows\\notepad.exe\n"
            "\n"
            "#/ PROG can be either with or without extension\n"
            "aoikwinwhich notepad.exe\n"
            "aoikwinwhich notepad\n"
            "aoikwinwhich C:\\Windows\\notepad.exe\n"
            "aoikwinwhich C:\\Windows\\notepad";

        //
        cout << usage_txt << endl;

        // 3nqHnP7
        exit_code = 1;

        return exit_code;
    }

    // 9m5B08H
    // Get executable name or path
    LPCTSTR prog = argv[1];

    // 8ulvPXM
    // Find executable paths
    //
    // Freed at 2jUVFP0
    list<WA_STRING>* exe_path_s = find_exe_paths(prog);

    // 5fWrcaF
    // If has found none
    if (!exe_path_s || !exe_path_s->size()) {
        // 3uswpx0
        exit_code = 2;
    }
    // If has found some
    else {
        // 9xPCWuS
        // Print result
        for (list<WA_STRING>::const_iterator iter = exe_path_s->begin();
            iter != exe_path_s->end();
            ++iter) {
            WA_COUT << WA_STRING(*iter) << endl;
        }

        // 4s1yY1b
        exit_code = 0;
    }

    // 2jUVFP0
    if (exe_path_s) {
        delete(exe_path_s);
    }

    //
    return exit_code;
}
```

## AoikWinWhich-Cpp-CLI
```
//
#include "stdafx.h"

using namespace System;
using namespace System::Collections::Generic;
using namespace System::IO;

//
bool contain (List<String^>^ item_s, String^ item) {
    for each (String^ itemx in item_s) {
      if (itemx->Equals(item)) {
        return true;
      }
    }

    return false;
}

List<String^>^ uniq (List<String^>^ item_s) {
  List<String^>^ item_s_new = gcnew List<String^>();
  
  for each (String^ item in item_s) {
    if (!contain(item_s_new, item)) {
      item_s_new->Add(item);
    }
  }

  return item_s_new;
}

List<String^>^ find_executable (String^ prog) {
    // 8f1kRCu
    String^ env_var_PATHEXT = Environment::GetEnvironmentVariable("PATHEXT");
    /// can be nullptr
  
    // 6qhHTHF
    // split into a list of extensions
    List<String^>^ ext_s = (env_var_PATHEXT == nullptr)
        ? gcnew List<String^>()
        : gcnew List<String^>(env_var_PATHEXT->Split(Path::PathSeparator));
  
    // 2pGJrMW
    // strip
  List<String^>^ ext_s_old = ext_s;

  ext_s = gcnew List<String^>();

  for each (String^ ext in ext_s_old) {
    ext_s->Add(ext->Trim());
  }
  
    // 2gqeHHl
    // remove empty
  ext_s_old = ext_s;

  ext_s = gcnew List<String^>();

  for each (String^ ext in ext_s_old) {
    if (!ext->Equals("")) {
      ext_s->Add(ext);
    }
  }
  
    // 2zdGM8W
    // convert to lowercase
  ext_s_old = ext_s;

  ext_s = gcnew List<String^>();

  for each (String^ ext in ext_s_old) {
    ext_s->Add(ext->ToLower());
  }

    // 2fT8aRB
    // uniquify
  ext_s = uniq(ext_s);
  
    // 4ysaQVN
    String^ env_var_PATH = Environment::GetEnvironmentVariable("PATH");
    /// can be nullptr
  
    List<String^>^ dir_path_s = (env_var_PATH == nullptr)
        ? gcnew List<String^>()
        : gcnew List<String^>(env_var_PATH->Split(Path::PathSeparator));
  
    // 5rT49zI
    // insert empty dir path to the beginning
    //
    // Empty dir handles the case that |prog| is a path, either relative or
    //  absolute. See code 7rO7NIN.
    dir_path_s->Insert(0, "");
  
    // 2klTv20
    // uniquify
    dir_path_s = uniq(dir_path_s);
  
    //
    String^ prog_lc = prog->ToLower();
  
    bool prog_has_ext = false;
  
  for each (String^ ext in ext_s) {
    if (prog_lc->EndsWith(ext)) {
      prog_has_ext = true;
    }
  }
  
    // 6bFwhbv
    List<String^>^ exe_path_s = gcnew List<String^>();
  
  for each (String^ dir_path in dir_path_s) {
        // 7rO7NIN
        // synthesize a path with the dir and prog
        String^ path = (dir_path->Equals(""))
            ? prog
            : Path::Combine(dir_path, prog);

        // 6kZa5cq
        // assume the path has extension, check if it is an executable
        if (prog_has_ext && File::Exists(path))
        {
            exe_path_s->Add(path);
        }
    
        // 2sJhhEV
        // assume the path has no extension
    for each (String^ ext in ext_s) {
            // 6k9X6GP
            // synthesize a new path with the path and the executable extension
            String^ path_plus_ext = path + ext;

            // 6kabzQg
            // check if it is an executable
      if (File::Exists(path_plus_ext))
      {
        exe_path_s->Add(path_plus_ext);
      }
    }
  }

    // 8swW6Av
    // uniquify
    exe_path_s = uniq(exe_path_s);

  //
  return exe_path_s;
}

int main(array<String ^> ^args)
{
    // 9mlJlKg
    if (args->Length != 1)
    {
        // 7rOUXFo
        // print program usage
        Console::WriteLine("Usage: aoikwinwhich PROG");
        Console::WriteLine("");
        Console::WriteLine("#/ PROG can be either name or path");
        Console::WriteLine("aoikwinwhich notepad.exe");
        Console::WriteLine("aoikwinwhich C:\\Windows\\notepad.exe");
        Console::WriteLine("");
        Console::WriteLine("#/ PROG can be either absolute or relative");
        Console::WriteLine("aoikwinwhich C:\\Windows\\notepad.exe");
        Console::WriteLine("aoikwinwhich Windows\\notepad.exe");
        Console::WriteLine("");
        Console::WriteLine("#/ PROG can be either with or without extension");
        Console::WriteLine("aoikwinwhich notepad.exe");
        Console::WriteLine("aoikwinwhich notepad");
        Console::WriteLine("aoikwinwhich C:\\Windows\\notepad.exe");
        Console::WriteLine("aoikwinwhich C:\\Windows\\notepad");

        // 3nqHnP7
        return 2;
    }

    // 9m5B08H
    // get name or path of a program from cmd arg
    String^ prog = args[0];

    // 8ulvPXM
    // find executables
  List<String^>^ path_s = find_executable(prog);
  
    // 5fWrcaF
    // has found none, exit
    if (path_s->Count == 0)
    {
        // 3uswpx0
        return 1;
    }

  // 9xPCWuS
  // has found some, output
  String^ txt = String::Join("\n", path_s);
  
    Console::WriteLine(txt);
  
    // 4s1yY1b
    return 0;
}
```

## AoikWinWhich-CSharp
```
//
using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;

//
namespace AoikWinWhich
{
    class AoikWinWhich
    {
        static List<String> find_executable(String prog)
        {
            // 8f1kRCu
            var env_var_PATHEXT = Environment.GetEnvironmentVariable("PATHEXT");
            /// can be null

            // 6qhHTHF
            // split into a list of extensions
            var ext_s = (env_var_PATHEXT == null)
                ? new List<String>()
                : new List<String>(env_var_PATHEXT.Split(Path.PathSeparator));

            // 2pGJrMW
            // strip
            ext_s = ext_s.Select(x => x.Trim()).ToList();

            // 2gqeHHl
            // remove empty
            ext_s = ext_s.Where(x => x != "").ToList();

            // 2zdGM8W
            // convert to lowercase
            ext_s = ext_s.Select(x => x.ToLower()).ToList();

            // 2fT8aRB
            // uniquify
            ext_s = ext_s.Distinct().ToList();

            // 4ysaQVN
            var env_var_PATH = Environment.GetEnvironmentVariable("PATH");
            /// can be null

            var dir_path_s = (env_var_PATH == null)
                ? new List<String>()
                : new List<String>(env_var_PATH.Split(Path.PathSeparator));

            // 5rT49zI
            // insert empty dir path to the beginning
            //
            // Empty dir handles the case that |prog| is a path, either relative or
            //  absolute. See code 7rO7NIN.
            dir_path_s.Insert(0, "");
            
            // 2klTv20
            // uniquify
            dir_path_s = dir_path_s.Distinct().ToList();
            
            //
            var prog_lc = prog.ToLower();

            var prog_has_ext = ext_s.Any(ext => prog_lc.EndsWith(ext));

            // 6bFwhbv
            var exe_path_s = new List<String>();

            foreach (var dir_path in dir_path_s)
            {
                // 7rO7NIN
                // synthesize a path with the dir and prog
                var path = (dir_path == "")
                    ? prog
                    : Path.Combine(dir_path, prog);
                
                // 6kZa5cq
                // assume the path has extension, check if it is an executable
                if (prog_has_ext && File.Exists(path))
                {
                    exe_path_s.Add(path);
                }

                // 2sJhhEV
                // assume the path has no extension
                foreach (var ext in ext_s)
                {
                    // 6k9X6GP
                    // synthesize a new path with the path and the executable extension
                    var path_plus_ext = path + ext;

                    // 6kabzQg
                    // check if it is an executable
                    if (File.Exists(path_plus_ext))
                    {
                        exe_path_s.Add(path_plus_ext);
                    }
                }
            }

            // 8swW6Av
            // uniquify
            exe_path_s = exe_path_s.Distinct().ToList();

            //
            return exe_path_s;
        }

        static void Main(String[] args)
        {
            // 9mlJlKg
            if (args.Length != 1)
            {
                // 7rOUXFo
                // print program usage
                Console.WriteLine(@"Usage: aoikwinwhich PROG");
                Console.WriteLine(@"");
                Console.WriteLine(@"#/ PROG can be either name or path");
                Console.WriteLine(@"aoikwinwhich notepad.exe");
                Console.WriteLine(@"aoikwinwhich C:\Windows\notepad.exe");
                Console.WriteLine(@"");
                Console.WriteLine(@"#/ PROG can be either absolute or relative");
                Console.WriteLine(@"aoikwinwhich C:\Windows\notepad.exe");
                Console.WriteLine(@"aoikwinwhich Windows\notepad.exe");
                Console.WriteLine(@"");
                Console.WriteLine(@"#/ PROG can be either with or without extension");
                Console.WriteLine(@"aoikwinwhich notepad.exe");
                Console.WriteLine(@"aoikwinwhich notepad");
                Console.WriteLine(@"aoikwinwhich C:\Windows\notepad.exe");
                Console.WriteLine(@"aoikwinwhich C:\Windows\notepad");

                // 3nqHnP7
                return;
            }

            // 9m5B08H
            // get name or path of a program from cmd arg
            var prog = args[0];

            // 8ulvPXM
            // find executables
            var path_s = find_executable(prog);

            // 5fWrcaF
            // has found none, exit
            if (path_s.Count == 0)
            {
                // 3uswpx0
                return;
            }

            // 9xPCWuS
            // has found some, output
            var txt = String.Join("\n", path_s);

            Console.WriteLine(txt);

            // 4s1yY1b
            return;
        }
    }
}
```

## AoikWinWhich-D
```
//
module aoikwinwhich;

import std.algorithm: any;
import std.algorithm: endsWith;
import std.algorithm: map;
import std.algorithm: filter;
import std.array : appender;
import std.array : array;
import std.array : join;
import std.array : split;
import std.file : FileException;
import std.file : isFile;
import std.path : buildPath;
import std.path : pathSeparator;
import std.process: env = environment;
import std.stdio : writeln;
import std.string : toLower;

//
bool contain(string[] item_s, string item) {
    foreach (_item; item_s) {
        if (_item == item) {
            return true;
        }
    }
    return false;
}

string[] uniq(string[] item_s) {
    auto item_s_new = appender!(string[]);

    foreach (item; item_s) {
        if (!contain(item_s_new.data, item)) {
            item_s_new.put(item);
        }
    }

    return item_s_new.data;
}

bool file_exists(string path) {
    auto path_is_file = false;

    try {
        path_is_file = path.isFile();
    } catch (FileException) {}

    return path_is_file;
}

string[] find_executable(string prog) {
    // 8f1kRCu
    auto env_var_PATHEXT = env.get(`PATHEXT`);
    /// can be ""

    // 6qhHTHF
    // split into a list of extensions
    auto ext_s = (env_var_PATHEXT == "")
        ? []
        : env_var_PATHEXT.split(pathSeparator);

    // 2pGJrMW
    // strip
    ext_s = array(ext_s.map!(x => x));

    // 2gqeHHl
    // remove empty
    ext_s = array(ext_s.filter!(x => x != ""));

    // 2zdGM8W
    // convert to lowercase
    ext_s = array(ext_s.map!(x => x.toLower()));

    // 2fT8aRB
    // uniquify
    ext_s = uniq(ext_s);

    // 4ysaQVN
    auto env_var_PATH = env.get(`PATH`);
    /// can be ""

    // 6mPI0lg
    auto dir_path_s = (env_var_PATH == "")
        ? []
        : env_var_PATH.split(pathSeparator);

    // 5rT49zI
    // insert empty dir path to the beginning
    //
    // Empty dir handles the case that |prog| is a path, either relative or
    //  absolute. See code 7rO7NIN.
    dir_path_s = [""] ~ dir_path_s;

    // 2klTv20
    // uniquify
    dir_path_s = uniq(dir_path_s);

    //
    auto prog_lower = prog.toLower();

    auto prog_has_ext = ext_s.any!(x => prog_lower.endsWith(x));

    // 6bFwhbv
    auto exe_path_s = appender!(string[]);

    foreach (dir_path; dir_path_s) {
        // 7rO7NIN
        // synthesize a path with the dir and prog
        auto path = (dir_path == "")
            ? prog
            : buildPath(dir_path, prog);

        // 6kZa5cq
        // assume the path has extension, check if it is an executable
        if (prog_has_ext && file_exists(path)) {
            exe_path_s.put(path);
        }

        // 2sJhhEV
        // assume the path has no extension
        foreach (ext; ext_s) {
            // 6k9X6GP
            // synthesize a new path with the path and the executable extension
            auto path_plus_ext = path ~ ext;

            // 6kabzQg
            // check if it is an executable
            if (file_exists(path_plus_ext)) {
                exe_path_s.put(path_plus_ext);
            }
        }
    }

    // 8swW6Av
    // uniquify
    auto exe_path_s_uniq = uniq(exe_path_s.data);

    //
    return exe_path_s_uniq;
}

void main(string[] args)
{
    // 9mlJlKg
    // check if one cmd arg is given
    if (args.length != 2) {
        // 7rOUXFo
        // print program usage
        writeln(`Usage: aoikwinwhich PROG`);
        writeln(``);
        writeln(`#/ PROG can be either name or path`);
        writeln(`aoikwinwhich notepad.exe`);
        writeln(`aoikwinwhich C:\Windows\notepad.exe`);
        writeln(``);
        writeln(`#/ PROG can be either absolute or relative`);
        writeln(`aoikwinwhich C:\Windows\notepad.exe`);
        writeln(`aoikwinwhich Windows\notepad.exe`);
        writeln(``);
        writeln(`#/ PROG can be either with or without extension`);
        writeln(`aoikwinwhich notepad.exe`);
        writeln(`aoikwinwhich notepad`);
        writeln(`aoikwinwhich C:\Windows\notepad.exe`);
        writeln(`aoikwinwhich C:\Windows\notepad`);

        // 3nqHnP7
        return;
    }

    // 9m5B08H
    // get name or path of a program from cmd arg
    auto prog = args[1];


    // 8ulvPXM
    // find executables
    auto path_s = find_executable(prog);

    // 5fWrcaF
    // has found none, exit
    if (path_s.length == 0) {
        // 3uswpx0
        return;
    }

    // 9xPCWuS
    // has found some, output
    auto txt = array(path_s).join("\n");

    writeln(txt);

    // 4s1yY1b
    return;
}
```

## AoikWinWhich-Dart
```
//
import 'dart:io' show File;
import 'dart:io' show Platform;

//
List<String> list_uniq(List item_s) {
    var item_s_uniq = [];

    for (var item in item_s) {
        if (!item_s_uniq.contains(item)) {
            item_s_uniq.add(item);
        }
    }

    return item_s_uniq;
}

List<String> find_executable(String prog) {
    // 8f1kRCu
    var env_var_PATHEXT = Platform.environment['PATHEXT'];
    /// can be null

    // 6qhHTHF
    // split into a list of extensions
    var sep = ';';

    var ext_s = (env_var_PATHEXT == null) ? [] : env_var_PATHEXT.split(sep);

    // 2pGJrMW
    // strip
    ext_s = ext_s.map((x) => x.trim());
    /// result is iterable

    // 2gqeHHl
    // remove empty
    ext_s = ext_s.where((x) => x != '');
    /// result is iterable

    // 2zdGM8W
    // convert to lowercase
    ext_s = ext_s.map((x) => x.toLowerCase());
    /// result is iterable

    // 2fT8aRB
    // uniquify
    ext_s = list_uniq(ext_s);
    /// result is list

    // 4ysaQVN
    var env_var_PATH = Platform.environment['PATH'];
    /// can be null

    // 6mPI0lg
    var dir_path_s = (env_var_PATH == null) ? [] : env_var_PATH.split(sep);

    // 5rT49zI
    // insert empty dir path to the beginning
    //
    // Empty dir handles the case that |prog| is a path, either relative or
    //  absolute. See code 7rO7NIN.
    dir_path_s.insert(0, '');

    // 2klTv20
    // uniquify
    dir_path_s = list_uniq(dir_path_s);

    //
    var prog_has_ext = ext_s.any((x) => prog.endsWith(x));

    // 6bFwhbv
    var exe_path_s = [];

    for (var dir_path in dir_path_s) {
        // 7rO7NIN
        // synthesize a path with the dir and prog
        var path = (dir_path == '')
            ? prog
            : dir_path + '\\' + prog;

        // 6kZa5cq
        // assume the path has extension, check if it is an executable
        if (prog_has_ext && new File(path).existsSync()) {
            exe_path_s.add(path);
        }

        // 2sJhhEV
        // assume the path has no extension
        for (var ext in ext_s) {
            // 6k9X6GP
            // synthesize a new path with the path and the executable extension
            var path_plus_ext = path + ext;

            // 6kabzQg
            // check if it is an executable
            if (new File(path_plus_ext).existsSync()) {
                exe_path_s.add(path_plus_ext);
            }
        }
    }

    // 8swW6Av
    // uniquify
    exe_path_s = list_uniq(exe_path_s);

    //
    return exe_path_s;
}

void main(List<String> args) {
    // 9mlJlKg
    if (args.length != 1) {
        // 7rOUXFo
        // print program usage
        print(r'Usage: aoikwinwhich PROG');
        print('');
        print(r'#/ PROG can be either name or path');
        print(r'aoikwinwhich notepad.exe');
        print(r'aoikwinwhich C:\Windows\notepad.exe');
        print('');
        print(r'#/ PROG can be either absolute or relative');
        print(r'aoikwinwhich C:\Windows\notepad.exe');
        print(r'aoikwinwhich Windows\notepad.exe');
        print('');
        print(r'#/ PROG can be either with or without extension');
        print(r'aoikwinwhich notepad.exe');
        print(r'aoikwinwhich notepad');
        print(r'aoikwinwhich C:\Windows\notepad.exe');
        print(r'aoikwinwhich C:\Windows\notepad');

        // 3nqHnP7
        return;
    }

    // 9m5B08H
    // get name or path of a program from cmd arg
    var prog = args[0];

    // 8ulvPXM
    // find executables
    var path_s = find_executable(prog);

    // 5fWrcaF
    // has found none, exit
    if (path_s.length == 0) {
        // 3uswpx0
        return;
    }

    // 9xPCWuS
    // has found some, output
    var txt = path_s.reduce((a, b) => a + '\n' + b);

    print(txt);

    // 4s1yY1b
    return;
}
```

## AoikWinWhich-Eiffel
```
    --
class
    AOIKWINWHICH

create
    make

feature {NONE} -- Create

    make
        local
            exc: EXCEPTIONS
        do
            create exc
            exc.die (main)
        end

feature {NONE} -- Main

        -- 4zKrqsC
        -- Program entry

    main: INTEGER
        local
            args: ARGUMENTS_32
            prog: STRING_32
            exe_path_s: LIST [STRING_32]
        do
                --
            create args

                -- 9mlJlKg
                -- If not exactly one command argument is given
            if args.argument_count /~ 1 then
                    -- 7rOUXFo
                    -- Print program usage
                print ("[
Usage: aoikwinwhich PROG

#/ PROG can be either name or path
aoikwinwhich notepad.exe
aoikwinwhich C:\Windows\notepad.exe

#/ PROG can be either absolute or relative
aoikwinwhich C:\Windows\notepad.exe
aoikwinwhich Windows\notepad.exe

#/ PROG can be either with or without extension
aoikwinwhich notepad.exe
aoikwinwhich notepad
aoikwinwhich C:\Windows\notepad.exe
aoikwinwhich C:\Windows\notepad

]")

                    -- 3nqHnP7
                    -- Exit
                RESULT := 1
            else

                    -- 9m5B08H
                    -- Get executable name or path
                prog := args.argument (1)

                    -- 8ulvPXM
                    -- Find executable paths
                exe_path_s := find_exe_paths (prog)

                    -- 5fWrcaF
                    -- If has found none
                if exe_path_s.count = 0 then
                        -- 3uswpx0
                        -- Exit
                    RESULT := 2
                else
                        -- If has found some

                        -- 9xPCWuS
                        -- Print result
                    across
                        exe_path_s as exe_path_i
                    loop
                        print (exe_path_i.item + "%N")
                    end

                        -- 4s1yY1b
                        -- Exit
                    RESULT := 0
                end
            end
        end

feature {NONE}

        --

    proc_lc: STRING_32
            -- "lc" means lowercase.
            -- Initialized at 6pyGU6b, used at 2t8XU4N.
            -- Eiffel's agent function can not access function arguments and local variables,
            -- so have to use an instance field.

        --

    find_exe_paths (prog: STRING_32): LIST [STRING_32]
        local
            env: EXECUTION_ENVIRONMENT
            env_pathext: detachable STRING_32
            env_path: detachable STRING_32
            ext_s: LIST [STRING_32]
            dir_path_s: LINKED_LIST [STRING_32]
            prog_has_ext: BOOLEAN
            exe_path_s: LINKED_LIST [STRING_32]
            path: STRING_32
            path_2: STRING_32
            file: PLAIN_TEXT_FILE
        do

                --
            create env

                -- 6pyGU6b
            proc_lc := prog.as_lower

                -- 8f1kRCu
            env_pathext := env.item ("PATHEXT")

                -- 4fpQ2RB
            if env_pathext = Void then
                    -- 9dqlPRg
                    -- Return
                Result := create {LINKED_LIST [STRING_32]}.make
            else

                    -- 6qhHTHF
                    -- Split into a list of extensions
                ext_s := env_pathext.split (';')

                    -- 2pGJrMW
                    -- Strip
                across
                    ext_s as ext_i
                loop
                        -- Mutate the string
                    ext_i.item.left_adjust
                    ext_i.item.right_adjust
                end

                    -- 2gqeHHl
                    -- Remove empty.
                    -- Must be done after the stripping at 2pGJrMW.
                ext_s := list_filter (ext_s, (agent  (ext: STRING_32): BOOLEAN
                    do
                        Result := ext /= ""
                    end))

                    -- 2zdGM8W
                    -- Convert to lowercase
                ext_s.do_all ((agent  (ext: STRING_32)
                    do
                            -- Mutate the string
                        ext.to_lower
                    end))

                    -- 2fT8aRB
                    -- Uniquify
                ext_s := list_uniq (ext_s)

                    -- 4ysaQVN
                env_path := env.item ("PATH")

                    -- 5gGwKZL
                if env_path = Void then
                        -- 7bVmOKe
                        -- Go ahead with "dir_path_s" being empty
                    dir_path_s := create {LINKED_LIST [STRING_32]}.make
                else

                        -- 6mPI0lg
                        -- Split into a list of dir paths
                    dir_path_s := list_to_linked_list (env_path.split (';'))
                end

                    -- 5rT49zI
                    -- Insert empty dir path to the beginning.
                    --
                    -- Empty dir handles the case that "prog" is not a short name,
                    -- either relative or absolute. See code 7rO7NIN.
                dir_path_s.start
                dir_path_s.put_left ("")

                    -- 2klTv20
                    -- Uniquify
                dir_path_s := list_uniq (dir_path_s)

                    -- 9gTU1rI
                    -- Check if "prog" ends with one of the file extension in "ext_s".
                prog_has_ext := ext_s.there_exists ((agent  (ext: STRING_32): BOOLEAN
                    do
                            -- 2t8XU4N
                        Result := proc_lc.ends_with (ext)
                    end))

                    -- 6bFwhbv
                create exe_path_s.make
                across
                    dir_path_s as dir_path_i
                loop
                        -- 7rO7NIN
                        -- Synthesize a path
                    if dir_path_i.item.is_equal ("") then
                        path := prog
                    else
                        path := dir_path_i.item + "\" + prog
                    end

                        --
                    create file.make_with_name (path)

                        -- 6kZa5cq
                        -- If "prog" ends with executable file extension
                    if prog_has_ext then
                            -- 3whKebE
                        if file.access_exists then
                                -- 2ffmxRF
                            exe_path_s.finish
                            exe_path_s.put_right (path)
                        end
                    end

                        -- 2sJhhEV
                        -- Assume user has omitted the file extension
                    across
                        ext_s as ext_i
                    loop
                            -- 6k9X6GP
                            -- Synthesize a path with one of the file extensions in PATHEXT
                        path_2 := path + ext_i.item
                        create file.make_with_name (path_2)

                            -- 6kabzQg
                        if file.access_exists then
                                -- 7dui4cD
                            exe_path_s.finish
                            exe_path_s.put_right (path_2)
                        end
                    end
                end

                    -- 8swW6Av
                    -- Uniquify
                exe_path_s := list_uniq (exe_path_s)

                    -- 7y3JlnS
                Result := exe_path_s
            end
        end

feature {NONE} -- List util

        --

    list_filter (item_s: LIST [STRING_32]; predicate: FUNCTION [ANY, TUPLE [STRING_32], BOOLEAN]): LIST [STRING_32]
        local
            res: LINKED_LIST [STRING_32]
        do
                --
            create res.make

                --
            across
                item_s as i
            loop
                if predicate.item (i.item) then
                    res.finish
                    res.put_right (i.item)
                end
            end

                --
            Result := res
        end

        --

    list_has_item (item_s: LIST [STRING_32]; item: STRING_32): BOOLEAN
            -- Comparison is by value equality using "STRING_32.is_equal".
        do
            from
                RESULT := false
                item_s.start
            until
                item_s.exhausted
            loop
                if item_s.item.is_equal (item) then
                    RESULT := true
                    item_s.finish
                end
                item_s.forth
            end
        end

        --

    list_uniq (item_s: LIST [STRING_32]): LINKED_LIST [STRING_32]
        local
            item_s_uniq: LINKED_LIST [STRING_32]
        do
                --
            create item_s_uniq.make

                --
            across
                item_s as item_i
            loop
                    -- `item_s_uniq.has(cur.item)` not works
                if not list_has_item (item_s_uniq, item_i.item) then
                    item_s_uniq.finish
                    item_s_uniq.put_right (item_i.item)
                end
            end

                --
            Result := item_s_uniq
        end

        --

    list_to_linked_list (item_s: LIST [STRING_32]): LINKED_LIST [STRING_32]
        do
                --
            create Result.make

                --
            across
                item_s as item_i
            loop
                Result.finish
                Result.put_right (item_i.item)
            end
        end

end
```

## AoikWinWhich-Erlang
```
%%

uniq(Item_s) ->
    lists:foldl(
        fun(Item, Acc) ->
            ItemExists = lists:member(Item, Acc),
            if ItemExists ->
                Acc
            ;true ->
                lists:append(Acc, [Item])
            end
        end, [], Item_s).

find_executale(Prog) ->
    %% 8f1kRCu
    EnvPATHENV = os:getenv("PATHEXT"),
    %%% can be false

    %% 6qhHTHF
    %% split into a list of extensions
    Ext_s =
        if EnvPATHENV == false ->
            []
        ;true ->
            string:tokens(EnvPATHENV, ";")
        end,

    %% 2pGJrMW
    %% strip
    Ext_s2 = lists:map(fun(X) -> string:strip(X) end, Ext_s),

    %% 2gqeHHl
    %% remove empty
    Ext_s3 = lists:filter(fun(X) -> X =/= "" end, Ext_s2),

    %% 2zdGM8W
    %% convert to lowercase
    Ext_s4 = lists:map(fun(X) -> string:to_lower(X) end, Ext_s3),

    %% 2fT8aRB
    %% uniquify
    Ext_s5 = gb_sets:to_list(gb_sets:from_list(Ext_s4)),

    %% 4ysaQVN
    EnvPATH = os:getenv("PATH"),
    %%% can be false

    %% 6mPI0lg
    Dir_s =
        if EnvPATH == false ->
            []
        ;true ->
            string:tokens(EnvPATH, ";")
        end,

    %% 5rT49zI
    %% insert empty dir path to the beginning
    %%
    %% Empty dir handles the case that |prog| is a path, either relative or
    %%  absolute. See code 7rO7NIN.
    Dir_s2 = ["" | Dir_s],

    %% 2klTv20
    %% uniquify
    Dir_s3 = uniq(Dir_s2),

    %%
    ProgLc = string:to_lower(Prog),

    ProgHasExt = lists:any(fun(Ext) -> lists:suffix(Ext, ProgLc) end, Ext_s5),

    %% 6bFwhbv
    Exe_path_s_res = lists:foldl(
        fun(Dir, Acc) ->
            %% 7rO7NIN
            %% synthesize a path with the dir and prog
            Path =
                if Dir == "" ->
                    Prog
                ;true ->
                    string:join([Dir, "\\" ,Prog], "")
                end,

            %% 6kZa5cq
            %% assume the path has extension, check if it is an executable
            PathExists = filelib:is_regular(Path),

            if ProgHasExt andalso PathExists ->
                Exe_path_s = [Path]
            ;true ->
                Exe_path_s = []
            end,

            %% 2sJhhEV
            %% assume the path has no extension
            Exe_path_s2 = [
                %% 6k9X6GP
                %% synthesize a new path with the path and the executable extension
                string:concat(Path, Ext) ||
                Ext <- Ext_s5,
                %% 6kabzQg
                %% check if it is an executable
                filelib:is_regular(string:concat(Path, Ext))
            ],

            %% New Acc result
            lists:append([Acc, Exe_path_s, Exe_path_s2])

        end, [], Dir_s3),

    %% 8swW6Av
    %% uniquify
    Exe_path_s_res2 = uniq(Exe_path_s_res),

    %%
    Exe_path_s_res2.

println(Str) ->
    io:format("~s~n", [Str]).

main(Args) ->
    %% 9mlJlKg
    if length(Args) =/= 1 ->
        %% 7rOUXFo
        %% print program usage
        println("Usage: aoikwinwhich PROG"),
        println(""),
        println("#/ PROG can be either name or path"),
        println("aoikwinwhich notepad.exe"),
        println("aoikwinwhich C:\\Windows\\notepad.exe"),
        println(""),
        println("#/ PROG can be either absolute or relative"),
        println("aoikwinwhich C:\\Windows\\notepad.exe"),
        println("aoikwinwhich Windows\\notepad.exe"),
        println(""),
        println("#/ PROG can be either with or without extension"),
        println("aoikwinwhich notepad.exe"),
        println("aoikwinwhich notepad"),
        println("aoikwinwhich C:\\Windows\\notepad.exe"),
        println("aoikwinwhich C:\\Windows\\notepad"),

        %% 3nqHnP7
        noop
    ;true ->
        %% 9m5B08H
        %% get name or path of a program from cmd arg
        Prog = lists:nth(1, Args),

        %% 8ulvPXM
        %% find executables
        Path_s = find_executale(Prog),

        %% 5fWrcaF
        %% has found none, exit
        if length(Path_s) == 0 ->
            %% 3uswpx0
            noop
        ;true ->
            %% 9xPCWuS
            %% has found some, output
            Txt = string:join(Path_s, "\n"),

            println(Txt),

            %% 4s1yY1b
            noop
        end
    end.
```

## AoikWinWhich-FSharp
```
//
namespace AoikWinWhich

type Console = System.Console
type Environment = System.Environment
type File = System.IO.File
type Path = System.IO.Path
type String = System.String

//
module AoikWinWhich =

    let find_executable (prog:string) =
        // 8f1kRCu
        let env_var_PATHEXT = Environment.GetEnvironmentVariable("PATHEXT")
        /// can be null
        
        // 6qhHTHF
        // split into a list of extensions
        let ext_s =
            if env_var_PATHEXT = null then
                []
            else
                env_var_PATHEXT.Split(Path.PathSeparator) |> Array.toList

        // 2pGJrMW
        // strip
        let ext_s = ext_s |> List.map (fun x -> x.Trim())
        
        // 2gqeHHl
        // remove empty
        let ext_s = ext_s |> List.filter (fun x -> x <> "")
        
        // 2zdGM8W
        // convert to lowercase
        let ext_s = ext_s |> List.map (fun x -> x.ToLower())
        
        // 2fT8aRB
        // uniquify
        let ext_s = ext_s |> Seq.distinct |> Seq.toList
        
        // 4ysaQVN
        let env_var_PATH = Environment.GetEnvironmentVariable("PATH")
        /// can be null
        
        let dir_path_s =
            if env_var_PATH = null then
                []
            else
                env_var_PATH.Split(Path.PathSeparator) |> Array.toList

        // 5rT49zI
        // insert empty dir path to the beginning
        //
        // Empty dir handles the case that |prog| is a path, either relative or
        //  absolute. See code 7rO7NIN.
        let dir_path_s = "" :: dir_path_s
        
        // 2klTv20
        // uniquify
        let dir_path_s = dir_path_s |> Seq.distinct |> Seq.toList
        
        //
        let prog_lc = prog.ToLower()
        
        let prog_has_ext = ext_s |> List.exists (fun ext -> prog_lc.EndsWith(ext))
        
        // 6bFwhbv
        let mutable exe_path_s = []

        for dir_path in dir_path_s do
            // 7rO7NIN
            // synthesize a path with the dir and prog
            let path =
                if dir_path = "" then
                    prog
                else
                    Path.Combine(dir_path, prog)
  
            // 6kZa5cq
            // assume the path has extension, check if it is an executable
            if prog_has_ext && File.Exists(path) then
                exe_path_s <- path :: exe_path_s
                ()

            // 2sJhhEV
            // assume the path has no extension
            for ext in ext_s do
                // 6k9X6GP
                // synthesize a new path with the path and the executable extension
                let path_plus_ext = path + ext

                // 6kabzQg
                // check if it is an executable
                if File.Exists(path_plus_ext) then
                    exe_path_s <- path_plus_ext :: exe_path_s
                    ()

        // reverse
        let exe_path_s = exe_path_s |> List.rev

        // 8swW6Av
        // uniquify
        let exe_path_s = exe_path_s |> Seq.distinct |> Seq.toList

        // return
        exe_path_s

    [<EntryPoint>]
    let main args =
        // 9mlJlKg
        let args_len = Array.length args

        if args_len <> 1 then
            // 7rOUXFo
            // print program usage
            Console.WriteLine(@"Usage: aoikwinwhich PROG")
            Console.WriteLine(@"")
            Console.WriteLine(@"#/ PROG can be either name or path")
            Console.WriteLine(@"aoikwinwhich notepad.exe")
            Console.WriteLine(@"aoikwinwhich C:\Windows\notepad.exe")
            Console.WriteLine(@"")
            Console.WriteLine(@"#/ PROG can be either absolute or relative")
            Console.WriteLine(@"aoikwinwhich C:\Windows\notepad.exe")
            Console.WriteLine(@"aoikwinwhich Windows\notepad.exe")
            Console.WriteLine(@"")
            Console.WriteLine(@"#/ PROG can be either with or without extension")
            Console.WriteLine(@"aoikwinwhich notepad.exe")
            Console.WriteLine(@"aoikwinwhich notepad")
            Console.WriteLine(@"aoikwinwhich C:\Windows\notepad.exe")
            Console.WriteLine(@"aoikwinwhich C:\Windows\notepad")
                
            // 3nqHnP7
            2
        else
            // 9m5B08H
            // get name or path of a program from cmd arg
            let prog = args.[0]

            // 8ulvPXM
            // find executables
            let path_s = find_executable(prog)

            //
            if path_s.Length = 0 then
                // 5fWrcaF
                // has found none, exit

                // 3uswpx0
                1
            else
                // 9xPCWuS
                // has found some, output
                let txt = String.Join("\n", path_s)
                
                Console.WriteLine(txt)

                // 4s1yY1b
                0
```

## AoikWinWhich-Go
```
package main

import "fmt"
import "os"
import "strings"

type strtostr func(string) string

type strtobool func(string) bool

func mapto(item_s []string, f strtostr) []string {
    item_s_new := []string{}

    for _, item := range item_s {
        item_new := f(item)
        item_s_new = append(item_s_new, item_new)
    }

    return item_s_new
}

func filter(item_s []string, f strtobool) []string {
    item_s_new := []string{}

    for _, item := range item_s {
        if f(item) {
            item_s_new = append(item_s_new, item)
        }
    }

    return item_s_new
}

func any(item_s []string, f strtobool) bool {
    for _, item := range item_s {
        if f(item) {
            return true
        }
    }

    return false
}

func contain(item_s []string, item string) bool {
    for _, x := range item_s {
        if x == item {
            return true
        }
    }
    return false
}

func append_uniq(item_s []string, item string) []string {
    if contain(item_s, item) {
        return item_s
    } else {
        return append(item_s, item)
    }
}

func uniq(item_s []string) []string {
    item_s_new := []string{}

    for _, item := range item_s {
        item_s_new = append_uniq(item_s_new, item)
    }

    return item_s_new;
}

// Modified from |http://stackoverflow.com/a/12527546|.
// ---BEG
func file_exists(path string) bool {
    _, err := os.Stat(path)

    if err != nil {
        if os.IsNotExist(err) {
            return false
        }
    }

    return true
}
// ---END

func find_executable(prog string) []string {
    // 8f1kRCu
    env_var_PATHEXT := os.Getenv("PATHEXT")
    /// can be ""

    // 6qhHTHF
    // split into a list of extensions
    val_sep := string(os.PathListSeparator)

    var ext_s []string = nil

    if env_var_PATHEXT == "" {
        ext_s = []string{}
    } else {
        ext_s = strings.Split(env_var_PATHEXT, val_sep)
    }

    // 2pGJrMW
    // strip
    ext_s = mapto(ext_s, func(x string) string {
        return strings.TrimSpace(x)
    })

    // 2gqeHHl
    // remove empty
    ext_s = filter(ext_s, func(x string) bool {
        return x != ""
    })

    // 2zdGM8W
    // convert to lowercase
    ext_s = mapto(ext_s, func(x string) string {
        return strings.ToLower(x)
    })

    // 2fT8aRB
    // uniquify
    ext_s = uniq(ext_s);

    // 4ysaQVN
    env_var_PATH := os.Getenv("PATH")
    /// can be ""

    // 6mPI0lg
    var dir_path_s []string = nil

    if env_var_PATH == "" {
        dir_path_s = []string{}
    } else {
        dir_path_s = strings.Split(env_var_PATH, val_sep)
    }

    // 5rT49zI
    // insert empty dir path to the beginning
    //
    // Empty dir handles the case that |prog| is a path, either relative or
    //  absolute. See code 7rO7NIN.
    dir_path_s = append([]string{""}, dir_path_s...)

    // 2klTv20
    // uniquify
    dir_path_s = uniq(dir_path_s)

    //
    prog_lower := strings.ToLower(prog)

    prog_has_ext := any(ext_s, func(x string) bool {
        return strings.HasSuffix(prog_lower, x)
    })

    // 6bFwhbv
    path_sep := string(os.PathSeparator)

    exe_path_s := []string{}

    for _, dir_path := range dir_path_s {
        // 7rO7NIN
        // synthesize a path with the dir and prog
        path := ""

        if dir_path == "" {
            path = prog
        } else {
            path = dir_path + path_sep + prog
        }

        // 6kZa5cq
        // assume the path has extension, check if it is an executable
        if prog_has_ext && file_exists(path) {
            exe_path_s = append(exe_path_s, path)
        }

        // 2sJhhEV
        // assume the path has no extension
        for _, ext := range ext_s {
            // 6k9X6GP
            // synthesize a new path with the path and the executable extension
            path_plus_ext := path + ext

            // 6kabzQg
            // check if it is an executable
            if file_exists(path_plus_ext) {
                exe_path_s = append(exe_path_s, path_plus_ext)
            }
        }
    }

    // 8swW6Av
    // uniquify
    exe_path_s = uniq(exe_path_s);

    //
    return exe_path_s
}

func main() {
    //
    println := fmt.Println

    // 9mlJlKg
    // check if one cmd arg is given
    args := os.Args[1:]

    if (len(args) != 1) {
        // 7rOUXFo
        // print program usage
        println(`Usage: aoikwinwhich PROG`);
        println(``);
        println(`#/ PROG can be either name or path`);
        println(`aoikwinwhich notepad.exe`);
        println(`aoikwinwhich C:\Windows\notepad.exe`);
        println(``);
        println(`#/ PROG can be either absolute or relative`);
        println(`aoikwinwhich C:\Windows\notepad.exe`);
        println(`aoikwinwhich Windows\notepad.exe`);
        println(``);
        println(`#/ PROG can be either with or without extension`);
        println(`aoikwinwhich notepad.exe`);
        println(`aoikwinwhich notepad`);
        println(`aoikwinwhich C:\Windows\notepad.exe`);
        println(`aoikwinwhich C:\Windows\notepad`);

        // 3nqHnP7
        return;
    }

    // 9m5B08H
    // get name or path of a program from cmd arg
    prog := args[0]

    // 8ulvPXM
    // find executables
    path_s := find_executable(prog);

    // 5fWrcaF
    // has found none, exit
    if (len(path_s) == 0) {
        // 3uswpx0
        return;
    }

    // 9xPCWuS
    // has found some, output
    txt := strings.Join(path_s, "\n")

    println(txt)

    // 4s1yY1b
    return;
}
```

## AoikWinWhich-Groovy
```
//
package aoikwinwhich
import java.io.File
import java.nio.file.Files
import java.nio.file.Paths

def find_executable(prog) {
    // 8f1kRCu
    def env_var_PATHEXT = System.getenv("PATHEXT")
    /// can be null

    // 6qhHTHF
    // split into a list of extensions
    def ext_s = (env_var_PATHEXT == null) ? [] :
        env_var_PATHEXT.split(File.pathSeparator).toList()

    // 2pGJrMW
    // strip
    ext_s = ext_s.collect({it.trim()})

    // 2gqeHHl
    // remove empty
    ext_s = ext_s.grep({!it.equals("")})

    // 2zdGM8W
    // convert to lowercase
    ext_s = ext_s.collect({it.toLowerCase()})

    // 2fT8aRB
    // uniquify
    ext_s.unique()

    // 4ysaQVN
    def env_var_PATH = System.getenv("PATH")
    /// can be null

    // 6mPI0lg
    def dir_path_s = (env_var_PATH == null) ? [] :
        env_var_PATH.split(File.pathSeparator).toList()

    // 5rT49zI
    // insert empty dir path to the beginning
    //
    // Empty dir handles the case that |prog| is a path, either relative or
    //  absolute. See code 7rO7NIN.
    dir_path_s.add(0, "")

    // 2klTv20
    // uniquify
    dir_path_s.unique()
    /// LinkedHashSet keeps the original order.

    // 6bFwhbv
    def exe_path_s = []

    for (dir_path in dir_path_s) {
        // 7rO7NIN
        // synthesize a path with the dir and prog
        def path = dir_path.equals("") ? prog :
            Paths.get(dir_path, prog).toString()

        // 6kZa5cq
        // assume the path has extension, check if it is an executable
        if (ext_s.any({path.endsWith(it)})) {
            if (Files.isRegularFile(Paths.get(path))) {
                exe_path_s.add(path)
            }
        }

        // 2sJhhEV
        // assume the path has no extension
        for (ext in ext_s) {
            // 6k9X6GP
            // synthesize a new path with the path and the executable extension
            def path_plus_ext = path + ext

            // 6kabzQg
            // check if it is an executable
            if (Files.isRegularFile(Paths.get(path_plus_ext))) {
                exe_path_s.add(path_plus_ext)
            }
        }
    }

    //
    return exe_path_s
}

def main2(args) {
    // 9mlJlKg
    // check if one cmd arg is given
    if (args.length != 1) {
        // 7rOUXFo
        // print program usage
        println(/Usage: aoikwinwhich PROG/)
        println("")
        println(/#\/ PROG can be either name or path/)
        println(/aoikwinwhich notepad.exe/)
        println(/aoikwinwhich C:\Windows\notepad.exe/)
        println("")
        println(/#\/ PROG can be either absolute or relative/)
        println(/aoikwinwhich C:\Windows\notepad.exe/)
        println(/aoikwinwhich Windows\\notepad.exe/)
        println("")
        println(/#\/ PROG can be either with or without extension/)
        println(/aoikwinwhich notepad.exe/)
        println(/aoikwinwhich notepad/)
        println(/aoikwinwhich C:\Windows\notepad.exe/)
        println(/aoikwinwhich C:\Windows\notepad/)

        // 3nqHnP7
        return
    }

    // 9m5B08H
    // get name or path of a program from cmd arg
    def prog = args[0]

    // 8ulvPXM
    // find executables
    def path_s = find_executable(prog)

    // 5fWrcaF
    // has found none, exit
    if (path_s.size() == 0) {
        // 3uswpx0
        return
    }

    // 9xPCWuS
    // has found some, output
    def txt = path_s.join("\n")

    println(txt)

    //
    return
}

//
main2(args)
/// |args| is func arg of the wrapping |main| func auto created by Groovy.
```

## AoikWinWhich-Haskell
```
--
import Control.Monad
import Control.Exception
import System.Directory (doesFileExist)
import System.Environment
import System.Exit
import qualified Data.Text as T
import qualified Data.List as List

--
iff :: Bool -> a -> a -> a
iff True  x _ = x
iff False _ y = y

--
strings_join :: String -> [String] -> String
strings_join delim [] = ""
strings_join delim (x:[]) = x
strings_join delim (x:xs) = x ++ delim ++ (strings_join delim xs)

--
texts_uniq :: [T.Text] -> [T.Text]
texts_uniq [] = []
texts_uniq (x:xs) =
    let xs_uniq = (texts_uniq xs)
    in
    iff (x `elem` xs_uniq)
        (xs_uniq)
        ([x] ++ xs_uniq)

--
getEnvOrEmpty :: String -> IO String
getEnvOrEmpty name =
    getEnv name `catch`
        -- "(e :: IOException)" is for hinting exception type
        (\e -> let _ = (e :: IOException) in return "")

--
find_exe_paths :: String -> IO [String]
find_exe_paths prog =
    do
        -- 8f1kRCu
        env_pathext <- getEnvOrEmpty "PATHEXT"

        -- 4fpQ2RB
        iff (env_pathext == "")
            -- then
            -- 9dqlPRg
            (return [])
            -- else
            (do
                -- 6qhHTHF
                -- Split into a list of extensions
                let ext_s = T.splitOn (T.pack ";") (T.pack env_pathext)

                -- 2pGJrMW
                -- Strip
                let ext_s_2 = map T.strip ext_s

                -- 2gqeHHl
                -- Remove empty
                let ext_s_3 = filter (\x -> x /= (T.pack "")) ext_s_2

                -- 2zdGM8W
                -- Convert to lowercase
                let ext_s_4 = map T.toLower ext_s_3

                -- 2fT8aRB
                -- Uniquify
                let ext_s_5 = texts_uniq ext_s_4

                -- 4ysaQVN
                env_path <- getEnvOrEmpty "PATH"

                -- 5gGwKZL
                let dir_path_s = iff (env_path == "")
                                    -- then
                                    -- 7bVmOKe
                                    -- Go ahead with "dir_path_s" being empty
                                    []
                                    -- else
                                    -- 6mPI0lg
                                    -- Split into a list of paths
                                    (T.splitOn (T.pack ";") (T.pack env_path))

                -- 5rT49zI
                -- Insert empty dir path to the beginning.
                --
                -- Empty dir handles the case that "prog" is a path, either
                -- relative or absolute. See code 7rO7NIN.
                let dir_path_s2 = [T.pack ""] ++ dir_path_s

                -- 2klTv20
                -- Uniquify
                let dir_path_s3 = texts_uniq dir_path_s2

                -- 9gTU1rI
                -- Check if "prog" ends with one of the file extension in
                -- "ext_s_5".
                --
                -- "ext_s_5" are all in lowercase, ensured at 2zdGM8W.
                let prog_lc = T.toLower (T.pack prog)

                let prog_has_ext = any (`T.isSuffixOf` prog_lc) ext_s_5

                -- 6bFwhbv
                exe_path_s <- liftM List.concat (
                    (`mapM` dir_path_s3) (\dir_path -> do
                        -- 7rO7NIN
                        -- Synthesize a path
                        let path = iff (dir_path == T.pack "")
                                        (T.pack prog)
                                        (T.concat [
                                                    dir_path
                                                    ,(T.pack "\\")
                                                    ,(T.pack prog)
                                                    ])

                        -- "exe_path" is used at 4bm0d25.
                        -- Its value being empty string means file not exist.
                        exe_path <-
                            -- 6kZa5cq
                            -- If "prog" ends with executable file extension
                            iff prog_has_ext
                            -- then
                            (do
                                file_exists <- (doesFileExist (T.unpack path))

                                -- 3whKebE
                                iff file_exists
                                    -- then
                                    -- 2ffmxRF
                                    (return path)
                                    -- else
                                    (return (T.pack ""))
                            )
                            -- else
                            (return (T.pack ""))

                        -- 2sJhhEV
                        -- Assume user has omitted the file extension
                        exe_path_s <- liftM List.concat (
                            (`mapM` ext_s_5) (\ext -> do
                                -- 6k9X6GP
                                -- Synthesize a path with one of the file
                                -- extensions in PATHEXT
                                let path_2 = (T.concat [path, ext])

                                file_exists_2 <-
                                    (doesFileExist (T.unpack path_2))

                                -- 6kabzQg
                                iff file_exists_2
                                    -- then
                                    -- 7dui4cD
                                    (return [path_2])
                                    -- else
                                    (return [])
                                )
                            )

                        -- 4bm0d25
                        iff (exe_path == (T.pack ""))
                            -- then
                            (return exe_path_s)
                            -- then
                            (return ([exe_path] ++ exe_path_s))

                        --
                        )
                    )

                -- 8swW6Av
                -- Uniquify
                let exe_path_s2 = texts_uniq exe_path_s

                -- Convert from Text to String
                let exe_path_s3 = map T.unpack exe_path_s2

                -- 7y3JlnS
                return exe_path_s3
            )

-- 4zKrqsC
-- Program entry
main = do
    --
    arg_s <- getArgs

    --
    let arg_cnt = length arg_s

    -- 9mlJlKg
    -- If not exactly one command argument is given
    iff (arg_cnt /= 1)
        -- then
        (do
            -- 7rOUXFo
            -- Print program usage
            let usage = strings_join "\n" [
                            "Usage: aoikwinwhich PROG",
                            "",
                            "#/ PROG can be either name or path",
                            "aoikwinwhich notepad.exe",
                            "aoikwinwhich C:\\Windows\\notepad.exe",
                            "",
                            "#/ PROG can be either absolute or relative",
                            "aoikwinwhich C:\\Windows\\notepad.exe",
                            "aoikwinwhich Windows\\notepad.exe",
                            "",
                            "#/ PROG can be either with or without extension",
                            "aoikwinwhich notepad.exe",
                            "aoikwinwhich notepad",
                            "aoikwinwhich C:\\Windows\\notepad.exe",
                            "aoikwinwhich C:\\Windows\\notepad\n"
                            ]

            putStr usage

            -- 3nqHnP7
            exitWith (ExitFailure 1)
        )
        -- else
        (do
            -- 9m5B08H
            -- Get executable name or path
            let prog = head arg_s

            -- 8ulvPXM
            -- Find executable paths
            exe_path_s <- find_exe_paths prog

            -- 5fWrcaF
            -- If has found none
            iff (length exe_path_s == 0)
                -- then
                (do
                    -- 3uswpx0
                    exitWith (ExitFailure 2)
                )
                -- else
                -- If has found some
                (do
                    -- 9xPCWuS
                    -- Print to stdout
                    putStrLn (strings_join "\n" exe_path_s)

                    -- 4s1yY1b
                    exitWith (ExitSuccess)
                )
        )
```

## AoikWinWhich-Hy
```
;
(import os)
(import os.path)

;
(defn list_uniq [item_s]
    ;
    (setv item_s_uniq [])

    (for [item item_s]
        (if (not (in item item_s_uniq))
            ; then
            (item_s_uniq.append item)
            ; else
            None
        )
    )

    ; Return
    item_s_uniq
)

;
(defn find_exe_paths [prog]
    ; 8f1kRCu
    (setv env_pathext (os.environ.get "PATHEXT" None))

    ; 4fpQ2RB
    (if (not env_pathext)
        ; then
        ; Return
        []
        ; else
        (do
            ; 6qhHTHF
            ; Split into a list of extensions
            (setv ext_s (env_pathext.split os.pathsep))

            ; 2pGJrMW
            ; Strip
            (setv ext_s (list-comp (x.strip) [x ext_s]))

            ; 2gqeHHl
            ; Remove empty.
            ; Must be done after the stripping at 2pGJrMW.
            (setv ext_s (list-comp x [x ext_s] (!= x "")))

            ; 2zdGM8W
            ; Convert to lowercase
            (setv ext_s (list-comp (x.lower) [x ext_s]))

            ; 2fT8aRB
            ; Uniquify
            (setv ext_s (list_uniq ext_s))

            ; 4ysaQVN
            (setv env_path (os.environ.get "PATH" None))

            ;
            (setv dir_path_s
                ; 5gGwKZL
                (if (not env_path)
                    ; then
                    ; 7bVmOKe
                    ; Go ahead with "dir_path_s" being empty
                    []
                    ; else
                    ; 6mPI0lg
                    ; Split into a list of dir paths
                    (env_path.split os.pathsep)
                )
            )

            ; 5rT49zI
            ; Insert empty dir path to the beginning
            ;
            ; Empty dir handles the case that "prog" is a path, either
            ; relative or absolute. See code 7rO7NIN.
            (dir_path_s.insert 0 "")

            ; 2klTv20
            ; Uniquify
            (setv dir_path_s (list_uniq dir_path_s))

            ; 9gTU1rI
            ; Check if "prog" ends with one of the file extension in
            ; "ext_s".
            ;
            ; "ext_s" are all in lowercase, ensured at 2zdGM8W.
            (setv prog_lc (prog.lower))

            (setv prog_has_ext (prog_lc.endswith (tuple ext_s)))
            ; "endswith" requires tuple, not list.

            ; 6bFwhbv
            (setv exe_path_s [])

            (for [dir_path dir_path_s]
                (do
                    ; 7rO7NIN
                    ; Synthesize a path
                    (setv path
                        (if (= dir_path "")
                            ; then
                            prog
                            ; else
                            (os.path.join dir_path prog)
                        )
                    )

                    ; 6kZa5cq
                    ; If "prog" ends with executable file extension
                    (if prog_has_ext
                        ; then
                        ; 3whKebE
                        (if (os.path.isfile path)
                            ; then
                            ; 2ffmxRF
                            (exe_path_s.append path)
                            ; else
                            None
                        )
                        ; else
                        None
                    )

                    ; 2sJhhEV
                    ; Assume user has omitted the file extension
                    (for [ext ext_s]
                        (do
                            ; 6k9X6GP
                            ; Synthesize a path with one of the file extensions
                            ; in PATHEXT
                            (setv path_2 (+ path ext))

                            ; 6kabzQg
                            (if (os.path.isfile path_2)
                                ; then
                                ; 7dui4cD
                                (exe_path_s.append path_2)
                                ; else
                                None
                            )
                        )
                    )
                )
            )

            ; 8swW6Av
            ; Uniquify
            (setv exe_path_s (list_uniq exe_path_s))

            ; 7y3JlnS
            ; Return
            exe_path_s
        )
    )
)

; 4zKrqsC
; Program entry
(defmain [&rest args]
    ; 9mlJlKg
    ; If not exactly one command argument is given
    (if (!= (len args) 2)
        ; then
        (do
            ; 7rOUXFo
            ; Print program usage
            (print r"Usage: aoikwinwhich PROG

#/ PROG can be either name or path
aoikwinwhich notepad.exe
aoikwinwhich C:\Windows\notepad.exe

#/ PROG can be either absolute or relative
aoikwinwhich C:\Windows\notepad.exe
aoikwinwhich Windows\notepad.exe

#/ PROG can be either with or without extension
aoikwinwhich notepad.exe
aoikwinwhich notepad
aoikwinwhich C:\Windows\notepad.exe
aoikwinwhich C:\Windows\notepad")

            ; 3nqHnP7
            ; Exit
            ;
            ; Hy 0.11.0 on Windows prints "defmain"'s return value, instead of
            ; setting the return value as exit code. So we return None here to
            ; avoid the printing.
            None
        )
        ; else
        (do
            ; 9m5B08H
            ; Get executable name or path
            (setv prog (. args[1]))

            ; 8ulvPXM
            ; Find executable paths
            (setv exe_path_s (find_exe_paths prog))

            ; 5fWrcaF
            ; If has found none
            (if (not exe_path_s)
                ; then
                ; Exit
                None
                ; else
                ; If has found some
                ;
                (do
                    ; 9xPCWuS
                    ; Print result
                    (print ((. "\n" join) exe_path_s))

                    ; 4s1yY1b
                    ; Exit
                    None
                )
            )
        )
    )
)
```

## AoikWinWhich-Java
```
//
package aoikwinwhich;
import static java.lang.System.out;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

public class AoikWinWhich {

    public static List<String> find_executable(String prog) {
        // 8f1kRCu
        String env_var_PATHEXT = System.getenv("PATHEXT");
        /// can be null

        // 6qhHTHF
        // split into a list of extensions
        List<String> ext_s = (env_var_PATHEXT == null)
            ? new LinkedList<>()
            : Arrays.asList(env_var_PATHEXT.split(File.pathSeparator));

        // 2pGJrMW
        // strip
        ext_s = ext_s.stream().map(String::trim).collect(Collectors.toList());

        // 2gqeHHl
        // remove empty
        ext_s = ext_s.stream().filter(x -> !x.equals("")).collect(Collectors.toList());

        // 2zdGM8W
        // convert to lowercase
        ext_s = ext_s.stream().map(String::toLowerCase).collect(Collectors.toList());

        // 2fT8aRB
        // uniquify
        ext_s = new LinkedList<>(new LinkedHashSet<>(ext_s));
        /// LinkedHashSet keeps the original order.

        // 4ysaQVN
        String env_var_PATH = System.getenv("PATH");
        /// can be null

        // 6mPI0lg
        List<String> dir_path_s = (env_var_PATH == null)
            ? new LinkedList<>()
            : new LinkedList<>(Arrays.asList(env_var_PATH.split(File.pathSeparator)));

        // 5rT49zI
        // insert empty dir path to the beginning
        //
        // Empty dir handles the case that |prog| is a path, either relative or
        //  absolute. See code 7rO7NIN.
        dir_path_s.add(0, "");

        // 2klTv20
        // uniquify
        dir_path_s = new LinkedList<>(new LinkedHashSet<>(dir_path_s));
        /// LinkedHashSet keeps the original order.

        // 6bFwhbv
        List<String> exe_path_s = new LinkedList<>();

        for (String dir_path : dir_path_s) {
            // 7rO7NIN
            // synthesize a path with the dir and prog
            final String path = dir_path.equals("") ? prog :
                                Paths.get(dir_path, prog).toString();
            /// |final| is needed for |path| to be used in the lambda below.

            // 6kZa5cq
            // assume the path has extension, check if it is an executable
            if (ext_s.parallelStream().anyMatch(ext -> path.endsWith(ext))) {
                if (Files.isRegularFile(Paths.get(path))) {
                    exe_path_s.add(path);
                }
            }

            // 2sJhhEV
            // assume the path has no extension
            for (String ext : ext_s) {
                // 6k9X6GP
                // synthesize a new path with the path and the executable extension
                String path_plus_ext = path + ext;

                // 6kabzQg
                // check if it is an executable
                if (Files.isRegularFile(Paths.get(path_plus_ext))) {
                    exe_path_s.add(path_plus_ext);
                }
            }
        }

        //
        return exe_path_s;
    }

    public static void main(String[] args) {
        // 9mlJlKg
        // check if one cmd arg is given
        if (args.length != 1) {
            // 7rOUXFo
            // print program usage
            out.println("Usage: aoikwinwhich PROG");
            out.println("");
            out.println("#/ PROG can be either name or path");
            out.println("aoikwinwhich notepad.exe");
            out.println("aoikwinwhich C:\\Windows\\notepad.exe");
            out.println("");
            out.println("#/ PROG can be either absolute or relative");
            out.println("aoikwinwhich C:\\Windows\\notepad.exe");
            out.println("aoikwinwhich Windows\\notepad.exe");
            out.println("");
            out.println("#/ PROG can be either with or without extension");
            out.println("aoikwinwhich notepad.exe");
            out.println("aoikwinwhich notepad");
            out.println("aoikwinwhich C:\\Windows\\notepad.exe");
            out.println("aoikwinwhich C:\\Windows\\notepad");

            // 3nqHnP7
            return;
        }

        // 9m5B08H
        // get name or path of a program from cmd arg
        String prog = args[0];

        // 8ulvPXM
        // find executables
        List<String> path_s = find_executable(prog);

        // 5fWrcaF
        // has found none, exit
        if (path_s.size() == 0) {
            // 3uswpx0
            return;
        }

        // 9xPCWuS
        // has found some, output
        String txt = String.join("\n", path_s);

        out.println(txt);

        //
        return;
    }
}
```

## AoikWinWhich-JavaScript
```
//
'use strict';

//
var _fs = require('fs');
var _path = require('path');
var _ = require('underscore');

// add func |endsWith| to String
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

function is_file(path) {
    var fstat = null;
    try {
        fstat = _fs.statSync(path);
    } catch (err) {
        return false;
    }
    return fstat && fstat.isFile();
}

function find_executable(prog) {
    // 8f1kRCu
    var env_var_PATHEXT = process.env.PATHEXT;
    /// can be |undefined|

    // 6qhHTHF
    // split into a list of extensions
    var ext_s = !env_var_PATHEXT ? [] : env_var_PATHEXT.split(_path.delimiter);

    // 2pGJrMW
    // strip
    ext_s = _.map(ext_s, function (ext) {
        return ext.trim();
    });

    // 2gqeHHl
    // remove empty
    ext_s = _.filter(ext_s, function (ext) {
        return ext !== '';
    });

    // 2zdGM8W
    // convert to lowercase
    ext_s = _.map(ext_s, function (ext) {
        return ext.toLowerCase();
    });

    // 2fT8aRB
    // uniquify
    ext_s = _.uniq(ext_s);

    // 4ysaQVN
    var env_var_PATH = process.env.PATH;
    /// can be |undefined|
    ///
    /// if has value, there is an ending |;| in it,
    ///  which results in an ending empty string for the splitting at 3zVznlK

    // 6mPI0lg
    var dir_path_s = !env_var_PATH ? [] : env_var_PATH.split(_path.delimiter);
    /// 3zVznlK

    // 5rT49zI
    // insert empty dir path to the beginning
    //
    // Empty dir handles the case that |prog| is a path, either relative or absolute.
    // See code 7rO7NIN.
    dir_path_s.unshift('');

    // 2klTv20
    // uniquify
    dir_path_s = _.uniq(dir_path_s);

    // 6bFwhbv
    var exe_path_s = [];
    _.each(dir_path_s, function (dir_path) {
        // 7rO7NIN
        // synthesize a path with the dir and prog
        var path = _path.join(dir_path, prog);

        // 6kZa5cq
        // assume the path has extension, check if it is an executable
        if (_.any(ext_s, function (ext) {
            return path.endsWith(ext);
        })) {
            if (is_file(path)) {
                exe_path_s.push(path);
            }
        }

        // 2sJhhEV
        // assume the path has no extension
        _.each(ext_s, function (ext) {
            // 6k9X6GP
            // synthesize a new path with the path and the executable extension
            var path_plus_ext = path + ext;
            // 6kabzQg
            // check if it is an executable
            if (is_file(path_plus_ext)) {
                exe_path_s.push(path_plus_ext);
            }
        });
    });

    // 8swW6Av
    // uniquify
    exe_path_s = _.uniq(exe_path_s);

    //
    return exe_path_s;
}

function print(txt) {
    process.stdout.write(txt + '\n');
}

function main() {
    // 9mlJlKg
    // check if one cmd arg is given
    var arg_s = process.argv.slice(2);

    if (arg_s.length != 1) {
        // 7rOUXFo
        // print program usage
        print('Usage: aoikwinwhich PROG');
        print('');
        print('#/ PROG can be either name or path');
        print('aoikwinwhich notepad.exe');
        print('aoikwinwhich C:\\Windows\\notepad.exe');
        print('');
        print('#/ PROG can be either absolute or relative');
        print('aoikwinwhich C:\\Windows\\notepad.exe');
        print('aoikwinwhich Windows\\notepad.exe');
        print('');
        print('#/ PROG can be either with or without extension');
        print('aoikwinwhich notepad.exe');
        print('aoikwinwhich notepad');
        print('aoikwinwhich C:\\Windows\\notepad.exe');
        print('aoikwinwhich C:\\Windows\\notepad');

        // 3nqHnP7
        return;
    }

    // 9m5B08H
    // get name or path of a program from cmd arg
    var prog = arg_s[0];

    // 8ulvPXM
    // find executables
    var path_s = find_executable(prog);

    // 5fWrcaF
    // has found none, exit
    if (!path_s.length) {
        // 3uswpx0
        return;
    }

    // 9xPCWuS
    // has found some, output
    var txt = path_s.join('\n');

    print(txt);

    // 4s1yY1b
    return;
}

//
exports.main = main;

//
if (require.main == module) {
    main();
}
```

## AoikWinWhich-Julia
```
#
function find_exe_paths(prog)
    # 8f1kRCu
    env_pathext = get(ENV, "PATHEXT", "")

    # 4fpQ2RB
    if env_pathext == ""
        # 9dqlPRg
        return []
    end

    # 6qhHTHF
    # Split into a list of extensions
    ext_s = split(env_pathext, ";")


    # 2pGJrMW
    # Strip
    ext_s = [strip(ext) for ext=ext_s]

    # 2gqeHHl
    # Remove empty.
    # Must be done after the stripping at 2pGJrMW.
    ext_s = filter(x -> x != "", ext_s)

    # 2zdGM8W
    # Convert to lowercase
    ext_s = [lowercase(ext) for ext=ext_s]

    # 2fT8aRB
    # Uniquify
    ext_s = unique(ext_s)

    # 4ysaQVN
    env_path = get(ENV, "PATH", "")

    # 5gGwKZL
    if env_path == ""
        # 7bVmOKe
        # Go ahead with "dir_path_s" being empty
        dir_path_s = []
    else
        # 6mPI0lg
        # Split into a list of dir paths
        dir_path_s = split(env_path, ";")
    end

    # 5rT49zI
    # Insert empty dir path to the beginning.
    #
    # Empty dir handles the case that "prog" is a path, either relative or
    # absolute. See code 7rO7NIN.
    unshift!(dir_path_s, "")

    # 2klTv20
    # Uniquify
    dir_path_s = unique(dir_path_s)

    # 9gTU1rI
    # Check if "prog" ends with one of the file extension in "ext_s".
    #
    # "ext_s" are all in lowercase, ensured at 2zdGM8W.
    prog_lc = lowercase(prog)

    prog_has_ext = (findfirst(ext -> endswith(prog_lc, ext), ext_s)) != 0
    # Index value "0" means not found.

    # 6bFwhbv
    exe_path_s = String[]

    for dir_path=dir_path_s
        # 7rO7NIN
        # Synthesize a path
        if dir_path == ""
            path = prog
        else
            path = dir_path * "\\" *  prog
        end

        # 6kZa5cq
        # If "prog" ends with executable file extension
        if prog_has_ext
            # 3whKebE
            if isfile(path)
                # 2ffmxRF
                push!(exe_path_s, path)
            end
        end

        # 2sJhhEV
        # Assume user has omitted the file extension
        for ext=ext_s
            # 6k9X6GP
            # Synthesize a path with one of the file extensions in PATHEXT
            path_2 = path * ext

            # 6kabzQg
            if isfile(path_2)
                # 7dui4cD
                push!(exe_path_s, path_2)
            end
        end
    end

    # 8swW6Av
    # Uniquify
    exe_path_s = unique(exe_path_s)

    # 7y3JlnS
    return exe_path_s
end

#
function main()
    # 9mlJlKg
    # If not exactly one command argument is given
    if length(ARGS) != 1
        usage = """Usage: aoikwinwhich PROG

#/ PROG can be either name or path
aoikwinwhich notepad.exe
aoikwinwhich C:\\Windows\\notepad.exe

#/ PROG can be either absolute or relative
aoikwinwhich C:\\Windows\\notepad.exe
aoikwinwhich Windows\\notepad.exe

#/ PROG can be either with or without extension
aoikwinwhich notepad.exe
aoikwinwhich notepad
aoikwinwhich C:\\Windows\\notepad.exe
aoikwinwhich C:\\Windows\\notepad"""

        # 7rOUXFo
        # Print program usage
        print(usage)

        # 3nqHnP7
        # Exit
        return 1
    end

    # 9m5B08H
    # Get executable name or path
    prog = ARGS[1]

    # 8ulvPXM
    # Find executable paths
    exe_path_s = find_exe_paths(prog)


    # 5fWrcaF
    # If has found none
    if length(exe_path_s) == 0
        # 3uswpx0
        # Exit
        return 2
    # If has found some
    else
        # 9xPCWuS
        # Print result
        print(join(exe_path_s, "\n") * "\n")

        # 4s1yY1b
        # Exit
        return 0
    end
end

# 4zKrqsC
# Program entry
exit(main())
```

## AoikWinWhich-Kotlin
```
//
package aoikwinwhich

import java.io.File
import java.nio.file.Files
import java.nio.file.Paths
import java.util.LinkedHashSet
import java.util.LinkedList

//
object AoikWinWhich {

    fun find_executable(prog: String): List<String> {
        // 8f1kRCu
        val env_var_PATHEXT = System.getenv("PATHEXT")
        /// can be null

        // 6qhHTHF
        // split into a list of extensions
        var ext_s =
            if (env_var_PATHEXT == null)
                listOf<String>()
            else
                env_var_PATHEXT.split(File.pathSeparator).toList()

        // 2pGJrMW
        // strip
        ext_s = ext_s.map({x -> x.trim()})

        // 2gqeHHl
        // remove empty
        ext_s = ext_s.filter({x -> x != ""})

        // 2zdGM8W
        // convert to lowercase
        ext_s = ext_s.map({x -> x.toLowerCase()})

        // 2fT8aRB
        // uniquify
        ext_s = LinkedHashSet(ext_s).toList()
        /// LinkedHashSet keeps the original order.

        // 4ysaQVN
        val env_var_PATH = System.getenv("PATH")
        /// can be null

        // 6mPI0lg
        var dir_path_s =
            if (env_var_PATH == null)
                linkedListOf<String>()
            else
                env_var_PATH.split(File.pathSeparator).toLinkedList()

        // 5rT49zI
        // insert empty dir path to the beginning
        //
        // Empty dir handles the case that |prog| is a path, either relative or
        //  absolute. See code 7rO7NIN.
        dir_path_s.add(0, "")

        // 2klTv20
        // uniquify
        dir_path_s = LinkedHashSet(dir_path_s).toLinkedList()
        /// LinkedHashSet keeps the original order.

        //
        val prog_lc = prog.toLowerCase()

        val prog_has_ext = ext_s.any({ext -> prog_lc.endsWith(ext)})

        // 6bFwhbv
        var exe_path_s = linkedListOf<String>()

        for (dir_path in dir_path_s) {
            // 7rO7NIN
            // synthesize a path with the dir and prog
            val path =
                if (dir_path == "")
                    prog
                else
                    Paths.get(dir_path, prog).toString()

            // 6kZa5cq
            // assume the path has extension, check if it is an executable
            if (prog_has_ext && Files.isRegularFile(Paths.get(path))) {
                 exe_path_s.add(path)
            }

            // 2sJhhEV
            // assume the path has no extension
            for (ext in ext_s) {
                // 6k9X6GP
                // synthesize a new path with the path and the executable extension
                val path_plus_ext = path + ext

                // 6kabzQg
                // check if it is an executable
                if (Files.isRegularFile(Paths.get(path_plus_ext))) {
                    exe_path_s.add(path_plus_ext)
                }
            }
        }

        // 8swW6Av
        // uniquify
        exe_path_s = LinkedHashSet(exe_path_s).toLinkedList()
        /// LinkedHashSet keeps the original order.

        //
        return exe_path_s
    }

    fun main(args: Array<String>) {
        // 9mlJlKg
        // check if one cmd arg is given
        if (args.size != 1) {
            // 7rOUXFo
            // print program usage
            println("""Usage: aoikwinwhich PROG""")
            println()
            println("""#/ PROG can be either name or path""")
            println("""aoikwinwhich notepad.exe""")
            println("""aoikwinwhich C:\Windows\notepad.exe""")
            println("")
            println("""#/ PROG can be either absolute or relative""")
            println("""aoikwinwhich C:\Windows\notepad.exe""")
            println("""aoikwinwhich Windows\notepad.exe""")
            println("")
            println("""#/ PROG can be either with or without extension""")
            println("""aoikwinwhich notepad.exe""")
            println("""aoikwinwhich notepad""")
            println("""aoikwinwhich C:\Windows\notepad.exe""")
            println("""aoikwinwhich C:\Windows\notepad""")

            // 3nqHnP7
            return
        }

        // 9m5B08H
        // get name or path of a program from cmd arg
        val prog = args[0]

        // 8ulvPXM
        // find executables
        val path_s = find_executable(prog)

        // 5fWrcaF
        // has found none, exit
        if (path_s.size == 0) {
            // 3uswpx0
            return
        }

        // 9xPCWuS
        // has found some, output
        val txt = path_s.join("\n")

        println(txt)

        // 4s1yY1b
        return
    }
}

//
fun main(args: Array<String>) {
    AoikWinWhich.main(args)
}
```

## AoikWinWhich-Lua
```
--

-- Copied from |http://lua-users.org/wiki/SplitJoin|.
-- Renamed from |explode| to |string.split|.
-- BEG
function string.split(p,d)
  local t, ll
  t={}
  ll=0
  if(#p == 1) then return {p} end
    while true do
      l=string.find(p,d,ll,true) -- find the next d in the string
      if l~=nil then -- if "not not" found then..
        table.insert(t, string.sub(p,ll,l-1)) -- Save it in our array.
        ll=l+1 -- save just after where we found it for searching next time.
      else
        table.insert(t, string.sub(p,ll)) -- Save what's left in our array.
        break -- Break at end, as it should be, according to the lua manual.
      end
    end
  return t
end
-- END

-- Copied from |http://lua-users.org/wiki/StringTrim|.
-- Renamed from |trim12| to |string.trim|.
-- BEG
function string.trim(s)
 local from = s:match"^%s*()"
 return from > #s and "" or s:match(".*%S", from)
end
-- END

-- Copied from |http://lua-users.org/wiki/StringRecipes|.
-- Renamed from |string.ends| to |string.endswith|.
-- BEG
function string.endswith(String,End)
   return End=='' or string.sub(String,-string.len(End))==End
end
-- END

function map(item_s, func)
    local item_s_new = {}

    for key, val in ipairs(item_s) do
        item_s_new[key] = func(val)
    end

    return item_s_new
end

function filter(item_s, func)
    local item_s_new = {}

    local ord = 0

    for key, val in ipairs(item_s) do
        if func(val) then
            ord = ord + 1
            item_s_new[ord] = val
        end
    end

    return item_s_new
end

function any(item_s, func)
    for key, val in ipairs(item_s) do
        if func(val) then
            return true
        end
    end

    return false
end

function uniq(item_s)
    --
    local val_ord_s = {}

    local ord_val_s_uniq = {}

    --
    local ord = 1

    for _, val in ipairs(item_s) do
        --
        val_exists = val_ord_s[val]
        --- can be nil

        if (not val_exists) then
            val_ord_s[val] = ord

            ord_val_s_uniq[ord] = val

            ord = ord + 1
        end
    end

    table.sort(ord_val_s_uniq, function (va, vb) return val_ord_s[va] < val_ord_s[vb] end)

    return ord_val_s_uniq
end

-- Copied from |http://stackoverflow.com/a/4991602|.
-- Choose not to add dependency on |lfs|
--  (http://keplerproject.github.io/luafilesystem/) so use a simple func that
--  only checks if the file is openable, not sure if it is regular file.
-- BEG
function file_exists(name)
   local f=io.open(name,"r")
   if f~=nil then io.close(f) return true else return false end
end
-- END

function find_executable(prog)
    -- 8f1kRCu
    local env_var_PATHEXT = os.getenv('PATHEXT')
    --- can be null

    -- 6qhHTHF
    -- split into a list of extensions
    local sep = ';'

    local ext_s = (not env_var_PATHEXT) and {} or env_var_PATHEXT:split(sep)

    -- 2pGJrMW
    -- strip
    ext_s = map(ext_s, function(x) return x:trim() end)

    -- 2gqeHHl
    -- remove empty
    ext_s = filter(ext_s, function(x) return x ~= '' end)

    -- 2zdGM8W
    -- convert to lowercase
    ext_s = map(ext_s, function(x) return x:lower() end)

    -- 2fT8aRB
    -- uniquify
    ext_s = uniq(ext_s)

    -- 4ysaQVN
    env_var_PATH = os.getenv('PATH')
    --- can be nil

    -- 6mPI0lg
    local dir_path_s = (not env_var_PATH) and {} or env_var_PATH:split(sep)

    -- 5rT49zI
    -- insert empty dir path to the beginning
    --
    -- Empty dir handles the case that |prog| is a path, either relative or
    --  absolute. See code 7rO7NIN.
    table.insert(dir_path_s, 1, '')

    -- 2klTv20
    -- uniquify
    dir_path_s = uniq(dir_path_s)

    --
    local prog_has_ext = any(ext_s, function(x) return prog:lower():endswith(x) end)

    -- 6bFwhbv
    exe_path_s = {}

    for _, dir_path in ipairs(dir_path_s) do
        -- 7rO7NIN
        -- synthesize a path with the dir and prog
        path = (dir_path == '') and prog or dir_path .. '\\' .. prog

        -- 6kZa5cq
        -- assume the path has extension, check if it is an executable
        if prog_has_ext and file_exists(path) then
            exe_path_s[#exe_path_s+1] = path
        end

        -- 2sJhhEV
        -- assume the path has no extension
        for _, ext in ipairs(ext_s) do
            -- 6k9X6GP
            -- synthesize a new path with the path and the executable extension
            path_plus_ext = path .. ext

            -- 6kabzQg
            -- check if it is an executable
            if file_exists(path_plus_ext) then
                exe_path_s[#exe_path_s+1] = path_plus_ext
            end
        end
    end

    -- 8swW6Av
    -- uniquify
    exe_path_s = uniq(exe_path_s)

    --
    return exe_path_s
end

function main()
    -- 9mlJlKg
    if (#arg ~= 1) then
        -- 7rOUXFo
        -- print program usage
        print([[Usage: aoikwinwhich PROG]])
        print('')
        print([[#/ PROG can be either name or path]])
        print([[aoikwinwhich notepad.exe]])
        print([[aoikwinwhich C:\Windows\notepad.exe]])
        print('')
        print([[#/ PROG can be either absolute or relative]])
        print([[aoikwinwhich C:\Windows\notepad.exe]])
        print([[aoikwinwhich Windows\notepad.exe]])
        print('')
        print([[#/ PROG can be either with or without extension]])
        print([[aoikwinwhich notepad.exe]])
        print([[aoikwinwhich notepad]])
        print([[aoikwinwhich C:\Windows\notepad.exe]])
        print([[aoikwinwhich C:\Windows\notepad]])

        -- 3nqHnP7
        return
    end

    -- 9m5B08H
    -- get name or path of a program from cmd arg
    local prog = arg[1]

    -- 8ulvPXM
    -- find executables
    local path_s = find_executable(prog)

    -- 5fWrcaF
    -- has found none, exit
    if (#path_s == 0) then
        -- 3uswpx0
        return
    end

    -- 9xPCWuS
    -- has found some, output
    local txt = table.concat(path_s, '\n')

    print(txt)

    -- 4s1yY1b
    return
end

--/
main()
```

## AoikWinWhich-OCaml
```
(**)
#load "str.cma";;

(**)
let rec list_uniq lst =
    match lst with
    | [] -> []
    | head::tail_s ->
        head :: (list_uniq (List.filter (fun x -> x <> head) tail_s))
;;

(**)
let string_endswith str tail =
    let str_len = String.length(str)  in
    let end_len = String.length(tail) in
    if str_len < end_len then
        false
    else (
        let str_tail = (String.sub str (str_len - end_len) end_len) in
            str_tail = tail
    )
;;

(**)
let find_exe_paths (prog) =
    (* 8f1kRCu *)
    let env_pathext = try Sys.getenv("PATHEXT") with Not_found -> ""
    in

    (* 4fpQ2RB *)
    if env_pathext = "" then (
        (* 9dqlPRg *)
        (* Return *)
        []
    )
    else (
        (* 6mPI0lg *)
        (* Split into a list of extensions *)
        let ext_s = (Str.split (Str.regexp ";") env_pathext)
        in

        (* 2pGJrMW *)
        (* Strip *)
        let ext_s = List.map (String.trim) ext_s
        in

        (* 2zdGM8W *)
        (* Convert to lowercase *)
        let ext_s = List.map (String.lowercase) ext_s
        in

        (* 2gqeHHl *)
        (* Remove empty.
        Must be done after the stripping at 2pGJrMW.
        *)
        let ext_s = List.filter (fun x -> x <> "") ext_s
        in

        (* 2fT8aRB *)
        (* Uniquify*)
        let ext_s = list_uniq(ext_s)
        in

        (* 4ysaQVN *)
        let env_path = try Sys.getenv("PATH") with Not_found -> ""
        in

        (**)
        let dir_path_s =
            (* 5gGwKZL *)
            if env_path = "" then (
                (* 7bVmOKe *)
                (* Go ahead with "dir_path_s" being empty *)
                []
            )
            else
                (* 6mPI0lg *)
                (* Split into a list of dir paths *)
                (Str.split (Str.regexp ";") env_path)
        in

        (* 5rT49zI*)
        (* Insert empty dir path to the beginning.

        Empty dir handles the case that "prog" is a path, either relative or
        absolute. See code 7rO7NIN.
        *)
        let dir_path_s = ("")::dir_path_s
        in

        (* 2klTv20 *)
        (* Uniquify *)
        let dir_path_s = list_uniq dir_path_s
        in

        (* Check if "prog" ends with one of the file extension in "ext_s"

        "ext_s" are all in lowercase, ensured at 2zdGM8W.
        *)
        let prog_has_ext =
            let prog_lc = String.lowercase(prog) in
                List.exists
                    (fun ext -> (string_endswith prog_lc ext)) ext_s in

        let exe_path_s = ref [] in

        (* 6bFwhbv *)
        let call_each item_s func = List.iter func item_s in

        begin
        call_each dir_path_s (fun dir_path ->
            (* 7rO7NIN *)
            (* Synthesize a path *)
            let path =
                if dir_path = "" then
                    prog
                else
                    String.concat "" [dir_path; "\\"; prog]
            in

            begin
            (* 6kZa5cq *)
            (* If "prog" ends with executable file extension *)
            if prog_has_ext then
                if Sys.file_exists(path) then
                    (* 2ffmxRF *)
                    exe_path_s := path :: !exe_path_s
            ;

            (* 2sJhhEV *)
            (* Assume user has omitted the file extension *)
            call_each ext_s (fun ext ->
                (* 6k9X6GP *)
                (* Synthesize a path with one of the file extensions in PATHEXT
                *)
                let path_2 = String.concat "" [path; ext]
                in

                (* 6kabzQg *)
                if Sys.file_exists(path_2) then
                    (* 7dui4cD *)
                    exe_path_s := path_2 :: !exe_path_s
                );
            end
        );

        (* 8swW6Av *)
        (* Uniquify *)
        exe_path_s := list_uniq !exe_path_s;

        (* Reverse, due to prepending at 2ffmxRF and 7dui4cD  *)
        exe_path_s := List.rev !exe_path_s;

        (* 7y3JlnS *)
        (* Return *)
        !exe_path_s
        end
    )
;;

(**)
let main () =
    (* 9mlJlKg *)
    (* If not exactly one command argument is given *)
    if Array.length Sys.argv <> 2 then (
        (* 7rOUXFo *)
        (* Print program usage *)
        let usage = "Usage: aoikwinwhich PROG

#/ PROG can be either name or path
aoikwinwhich notepad.exe
aoikwinwhich C:\\Windows\\notepad.exe

#/ PROG can be either absolute or relative
aoikwinwhich C:\\Windows\\notepad.exe
aoikwinwhich Windows\\notepad.exe

#/ PROG can be either with or without extension
aoikwinwhich notepad.exe
aoikwinwhich notepad
aoikwinwhich C:\\Windows\\notepad.exe
aoikwinwhich C:\\Windows\\notepad"
        in
            print_endline(usage);

        (* 3nqHnP7 *)
        (* Exit *)
        1
    )
    else (
        (* 9m5B08H *)
        (* Get executable name or path *)
        let prog = Sys.argv.(1) in

        (* 8ulvPXM *)
        (* Find executable paths *)
        let exe_path_s = find_exe_paths(prog) in

        (* 5fWrcaF *)
        (* If has found none *)
        if List.length(exe_path_s) = 0 then
            (* 3uswpx0 *)
            (* Exit *)
            2
        (* 5fWrcaF *)
        (* If has found none *)
        else (
            (* 9xPCWuS *)
            (* Print result *)
            print_endline(String.concat "\n" exe_path_s);

            (* 4s1yY1b *)
            (* Exit *)
            0
        )
    );
;;

(* 4zKrqsC *)
(* Program entry *)
let () =
    exit(main());
;;
```

## AoikWinWhich-Pascal
```
//
program AoikWinWhich;

uses
  Classes,
  SysUtils,
  strutils;

  function StringSplit(str: string; delim: char): TStringList;
  begin
    Result := TStringList.Create;
    Result.StrictDelimiter := True;
    Result.Delimiter := delim;
    Result.DelimitedText := str;
  end;

  function StringListUniq(item_s: TStringList): TStringList;
  var
    i: integer;
    item: string;
  begin
    Result := TStringList.Create;

    for i := 0 to item_s.Count - 1 do
    begin
      item := item_s[i];

      if Result.IndexOf(item) = -1 then
        Result.add(item);
    end;
  end;

  function FindExePaths(prog: string): TStringList;
  var
    env_pathext: string;
    i: integer;
    ext: string;
    ext_s: TStringList;
    ext_s_2: TStringList;
    env_path: string;
    dir_path: string;
    dir_path_s: TStringList;
    prog_lc: string;
    prog_has_ext: boolean;
    exe_path_s: TStringList;
    path: string;
    path2: string;
  begin
    // 8f1kRCu
    env_pathext := GetEnvironmentVariable('PATHEXT');

    // 4fpQ2RB
    if env_pathext = '' then
       // 9dqlPRg
       exit();

    // 6qhHTHF
    // Split into a list of extensions
    ext_s := StringSplit(env_pathext, ';');

    //
    ext_s_2 := TStringList.Create;

    for i := 0 to ext_s.Count - 1 do
    begin
      ext := ext_s[i];

      // 2pGJrMW
      // Strip
      ext := Trim(ext);

      // 2gqeHHl
      // Remove empty.
      // Must be done after the stripping at 2pGJrMW.
      if ext <> '' then
      begin
        // 2zdGM8W
        // Convert to lowercase
        ext := LowerCase(ext);

        ext_s_2.add(ext);
      end;

      // 2fT8aRB
      // Uniquify
      ext_s_2 := StringListUniq(ext_s_2);

      // 4ysaQVN
      env_path := GetEnvironmentVariable('PATH');

      // 5gGwKZL
      if env_path = '' then
        // 7bVmOKe
        // Go ahead with "dir_path_s" being empty
        dir_path_s := TStringList.Create
      else
        // 6mPI0lg
        // Split into a list of paths
        dir_path_s := StringSplit(env_path, ';');

      // 5rT49zI
      // Insert empty dir path to the beginning.
      //
      // Empty dir handles the case that "prog" is a path, either relative or
      //  absolute. See code 7rO7NIN.
      dir_path_s.Insert(0, '');

      // 2klTv20
      // Uniquify
      dir_path_s := StringListUniq(dir_path_s);

      // 9gTU1rI
      // Check if "prog" ends with one of the file extension in "ext_s".
      //
      // "ext_s_2" are all in lowercase, ensured at 2zdGM8W.
      prog_lc := LowerCase(prog);

      prog_has_ext := False;

      for ext in ext_s_2 do
        if AnsiEndsStr(ext, prog_lc) then
        begin
          prog_has_ext := True;

          break;
        end;

      // 6bFwhbv
      exe_path_s := TStringList.Create;

      for dir_path in dir_path_s do
      begin
        // 7rO7NIN
        // Synthesize a path
        if dir_path = '' then
          path := prog
        else
          path := dir_path + '\' + prog;

        // 6kZa5cq
        // If "prog" ends with executable file extension
        if prog_has_ext then
        begin
          // 3whKebE
          if FileExists(path) then
            // 2ffmxRF
            exe_path_s.add(path);
        end;

        // 2sJhhEV
        // Assume user has omitted the file extension
        for ext in ext_s_2 do
        begin
          // 6k9X6GP
          // Synthesize a path with one of the file extensions in PATHEXT
          path2 := path + ext;

          // 6kabzQg
          if FileExists(path2) then
             // 7dui4cD
             exe_path_s.add(path2);
        end;
      end;
    end;

    // 8swW6Av
    // Uniquify
    exe_path_s := StringListUniq(exe_path_s);

    // 7y3JlnS
    Result := exe_path_s;
  end;

  function Main: integer;
  var
    usage: string;
    prog: string;
    exe_path_s: TStringList;
    i: integer;
  begin
    // 9mlJlKg
    // If not exactly one command argument is given
    if ParamCount <> 1 then
    begin
      // 7rOUXFo
      // Print program usage
      usage :=
        'Usage: aoikwinwhich PROG'#10 +
        #10 +
        '#/ PROG can be either name or path'#10 +
        'aoikwinwhich notepad.exe'#10 +
        'aoikwinwhich C:\Windows\notepad.exe'#10 +
        #10 +
        '#/ PROG can be either absolute or relative'#10 +
        'aoikwinwhich C:\Windows\notepad.exe'#10 +
        'aoikwinwhich Windows\notepad.exe'#10 +
        #10 +
        '#/ PROG can be either with or without extension'#10 +
        'aoikwinwhich notepad.exe'#10 +
        'aoikwinwhich notepad'#10 +
        'aoikwinwhich C:\Windows\notepad.exe'#10 +
        'aoikwinwhich C:\Windows\notepad';

      Writeln(usage);

      // 3nqHnP7
      exit(1);
    end;

    // 9m5B08H
    // Get executable name or path
    prog := ParamStr(1);

    // 8ulvPXM
    // Find executable paths
    exe_path_s := FindExePaths(prog);

    // 5fWrcaF
    // If has found none
    if exe_path_s.Count = 0 then
    begin
      // 3uswpx0
      exit(2);
    end
    // If has found some
    else
    begin
      // 9xPCWuS
      // Print result
      for i := 0 to exe_path_s.Count - 1 do
        Writeln(exe_path_s[i]);

      // 4s1yY1b
      exit(0);
    end;
  end;

begin
  // 4zKrqsC
  // Program entry
  exitcode := Main;
end.
```

## AoikWinWhich-Perl
```
#/
use File::Spec;
use List::Util;

#/
sub find_executable {
    #/
    my $prog = $_[0];

    #/ 8f1kRCu
    my $env_var_PATHEXT = $ENV{'PATHEXT'};
    ## can be undef

    #/ 6qhHTHF
    #/ split into a list of extensions
    my @ext_s =
        !defined(env_var_PATHEXT)
        ? ()
        : split(';', $env_var_PATHEXT);

    #/ 2pGJrMW
    #/ strip
    s{^\s+|\s+$}{}g for @ext_s;

    #/ 2gqeHHl
    #/ remove empty
    @ext_s = grep {$_ ne ''} @ext_s;

    #/ 2zdGM8W
    #/ convert to lowercase
    $_ = lc for @ext_s;

    #/ 2fT8aRB
    #/ uniquify
    my %seen = ();
    my @ext_s = grep {!$seen{$_}++} @ext_s;

    #/ 4ysaQVN
    my $env_var_PATH = $ENV{'PATH'};
    ## can be undef

    #/ 6mPI0lg
    my @dir_path_s =
        !defined($env_var_PATH)
        ? ()
        : split(';', $env_var_PATH);

    #/ 5rT49zI
    #/ insert empty dir path to the beginning
    #/
    #/ Empty dir handles the case that |prog| is a path, either relative or
    #/  absolute. See code 7rO7NIN.
    unshift(@dir_path_s, '');

    #/ 2klTv20
    #/ uniquify
    my %seen = ();
    my @dir_path_s = grep {!$seen{$_}++} @dir_path_s;

    #/ 6bFwhbv
    my @exe_path_s = ();

    for my $dir_path (@dir_path_s) {
        #/ 7rO7NIN
        #/ synthesize a path with the dir and prog
        my $path = $dir_path eq "" ? $prog :
            File::Spec->catpath(undef, $dir_path, $prog);

        #/ 6kZa5cq
        #/ assume the path has extension, check if it is an executable
        if (List::Util::any {2 > 1} @ext_s) {
            if (-f $path) {
                push(@exe_path_s, $path);
            }
        }

        #/ 2sJhhEV
        #/ assume the path has no extension
        for my $ext (@ext_s) {
            #/ 6k9X6GP
            #/ synthesize a new path with the path and the executable extension
            my $path_plus_ext = $path . $ext;

            #/ 6kabzQg
            #/ check if it is an executable
            if (-f $path_plus_ext) {
                push(@exe_path_s, $path_plus_ext);
            }
        }
    }

    #/
    return @exe_path_s;
}

sub say {
    print @_, "\n";
}

sub main() {
    #/ 9mlJlKg
    #/ check if one cmd arg is given
    my $argv_len = $#ARGV + 1;

    if ($argv_len != 1) {
        #/ 7rOUXFo
        #/ print program usage
        say 'Usage: aoikwinwhich PROG';
        say '';
        say '#/ PROG can be either name or path';
        say 'aoikwinwhich notepad.exe';
        say 'aoikwinwhich C:\Windows\notepad.exe';
        say '';
        say '#/ PROG can be either absolute or relative';
        say 'aoikwinwhich C:\Windows\notepad.exe';
        say 'aoikwinwhich Windows\\notepad.exe';
        say '';
        say '#/ PROG can be either with or without extension';
        say 'aoikwinwhich notepad.exe';
        say 'aoikwinwhich notepad';
        say 'aoikwinwhich C:\Windows\notepad.exe';
        say 'aoikwinwhich C:\Windows\notepad';

        #/ 3nqHnP7
        return;
    }

    #/ 9m5B08H
    #/ get name or path of a program from cmd arg
    my $prog = $ARGV[0];

    #/ 8ulvPXM
    #/ find executables
    my @path_s = find_executable($prog);

    #/ 5fWrcaF
    #/ has found none, exit
    if (scalar @path_s == 0) {
        #/ 3uswpx0
        return;
    }

    #/ 9xPCWuS
    #/ has found some, output
    my $txt = join("\n", @path_s);

    say $txt;

    #/
    return;
}

#/
unless (caller) {
    main();
}
```

## AoikWinWhich-PHP
```
<?php

#/ define a string |endswith| function
function endsWith($str, $sub) {
    return (substr($str, strlen($str) - strlen($sub)) == $sub);
}

function find_executable($prog) {
    #/ 8f1kRCu
    $env_var_PATHEXT = getenv('PATHEXT');
    ## can be False

    #/ 6qhHTHF
    #/ split into a list of extensions
    $ext_s = ($env_var_PATHEXT === False)
        ? []
        : explode(PATH_SEPARATOR, $env_var_PATHEXT);

    #/ 2pGJrMW
    #/ strip
    $ext_s = array_map(function($x) {
        return trim($x);
    }, $ext_s);

    #/ 2gqeHHl
    #/ remove empty
    $ext_s = array_filter($ext_s, function($x) {
        return $x !== '';
    });

    #/ 2zdGM8W
    #/ convert to lowercase
    $ext_s = array_map(function($x) {
        return strtolower($x);
    }, $ext_s);

    #/ 2fT8aRB
    #/ uniquify
    $ext_s = array_unique($ext_s);

    #/ 4ysaQVN
    $env_var_PATH = getenv('PATH');
    ## can be False

    #/ 6mPI0lg
    $dir_path_s = ($env_var_PATH === False)
        ? []
        : explode(PATH_SEPARATOR, $env_var_PATH);

    #/ 5rT49zI
    #/ insert empty dir path to the beginning
    ##
    ## Empty dir handles the case that |prog| is a path, either relative or
    ##  absolute. See code 7rO7NIN.
    array_unshift($dir_path_s, '');

    #/ 2klTv20
    #/ uniquify
    $dir_path_s = array_unique($dir_path_s);

    #/ 6bFwhbv
    $exe_path_s = Array();

    foreach ($dir_path_s as $dir_path) {
        #/ 7rO7NIN
        #/ synthesize a path with the dir and prog
        if ($dir_path === '') {
            $path = $prog;
        }
        else {
            $path = implode(DIRECTORY_SEPARATOR, array($dir_path, $prog));
        }

        #/ 6kZa5cq
        ## assume the path has extension, check if it is an executable
        $path_has_ext = array_filter($ext_s, function($ext) use ($path){
            return endsWith($path, $ext);
        }) !== array();

        if ($path_has_ext && is_file($path)) {
            $exe_path_s[] = $path;
        }

        #/ 2sJhhEV
        ## assume the path has no extension
        foreach ($ext_s as $ext) {
            #/ 6k9X6GP
            #/ synthesize a new path with the path and the executable extension
            $path_plus_ext = $path . $ext;

            #/ 6kabzQg
            #/ check if it is an executable
            if (is_file($path_plus_ext)) {
                $exe_path_s[] = $path_plus_ext;
            }
        }
    }

    #/
    return $exe_path_s;
}

function println($txt) {
    print($txt);
    print("\n");
}

function main() {
    #/ 9mlJlKg
    global $argv;

    $arg_s = array_slice($argv, 1);

    if (count($arg_s) != 1) {
        #/ 7rOUXFo
        #/ print program usage
        println('Usage: aoikwinwhich PROG');
        println('');
        println('#/ PROG can be either name or path');
        println('aoikwinwhich notepad.exe');
        println('aoikwinwhich C:\Windows\notepad.exe');
        println('');
        println('#/ PROG can be either absolute or relative');
        println('aoikwinwhich C:\Windows\notepad.exe');
        println('aoikwinwhich Windows\notepad.exe');
        println('');
        println('#/ PROG can be either with or without extension');
        println('aoikwinwhich notepad.exe');
        println('aoikwinwhich notepad');
        println('aoikwinwhich C:\Windows\notepad.exe');
        println('aoikwinwhich C:\Windows\notepad');

        #/ 3nqHnP7
        return;
    }

    #/ 9m5B08H
    #/ get name or path of a program from cmd arg
    $prog = $arg_s[0];

    #/ 8ulvPXM
    #/ find executables
    $path_s = find_executable($prog);

    #/ 5fWrcaF
    #/ has found none, exit
    if (empty($path_s)) {
        #/ 3uswpx0
        return;
    }

    #/ 9xPCWuS
    #/ has found some, output
    $txt = implode("\n", $path_s);

    println($txt);

    #/ 4s1yY1b
    return;
}

#/
if (!debug_backtrace())
{
    main();
}
?>
```

## AoikWinWhich-Python
```
# coding: utf-8

#
import os
import sys


#
def list_uniq(item_s):
    item_s_uniq = []

    for item in item_s:
        if item not in item_s_uniq:
            item_s_uniq.append(item)

    return item_s_uniq

# "exe" means executable, not just paths ending with ".exe"
def find_exe_paths(prog):
    # 8f1kRCu
    env_pathext = os.environ.get('PATHEXT', None)

    # 4fpQ2RB
    if not env_pathext:
        # 9dqlPRg
        return []

    # 6qhHTHF
    # Split into a list of extensions
    ext_s = env_pathext.split(os.pathsep)

    # 2pGJrMW
    # Strip
    ext_s = [x.strip() for x in ext_s]

    # 2gqeHHl
    # Remove empty.
    # Must be done after the stripping at 2pGJrMW.
    ext_s = [x for x in ext_s if x != '']

    # 2zdGM8W
    # Convert to lowercase
    ext_s = [x.lower() for x in ext_s]

    # 2fT8aRB
    # Uniquify
    ext_s = list_uniq(ext_s)

    # 4ysaQVN
    env_path = os.environ.get('PATH', None)

    # 5gGwKZL
    if not env_path:
        # 7bVmOKe
        # Go ahead with "dir_path_s" being empty
        dir_path_s = []
    else:
        # 6mPI0lg
        # Split into a list of dir paths
        dir_path_s = env_path.split(os.pathsep)

    # 5rT49zI
    # Insert empty dir path to the beginning.
    #
    # Empty dir handles the case that "prog" is a path, either relative or
    #  absolute. See code 7rO7NIN.
    dir_path_s.insert(0, '')

    # 2klTv20
    # Uniquify
    dir_path_s = list_uniq(dir_path_s)

    # 9gTU1rI
    # Check if "prog" ends with one of the file extension in "ext_s".
    #
    # "ext_s" are all in lowercase, ensured at 2zdGM8W.
    prog_lc = prog.lower()

    prog_has_ext = prog_lc.endswith(tuple(ext_s))
    # "endswith" requires tuple, not list.

    # 6bFwhbv
    exe_path_s = []

    for dir_path in dir_path_s:
        # 7rO7NIN
        # Synthesize a path
        if dir_path == '':
            path = prog
        else:
            path = os.path.join(dir_path, prog)

        # 6kZa5cq
        # If "prog" ends with executable file extension
        if prog_has_ext:
            # 3whKebE
            if os.path.isfile(path):
                # 2ffmxRF
                exe_path_s.append(path)

        # 2sJhhEV
        # Assume user has omitted the file extension
        for ext in ext_s:
            # 6k9X6GP
            # Synthesize a path with one of the file extensions in PATHEXT
            path_2 = path + ext

            # 6kabzQg
            if os.path.isfile(path_2):
                # 7dui4cD
                exe_path_s.append(path_2)

    # 8swW6Av
    # Uniquify
    exe_path_s = list_uniq(exe_path_s)

    # 7y3JlnS
    return exe_path_s

#
def main():
    # 9mlJlKg
    # If not exactly one command argument is given
    if len(sys.argv) != 2:
        # 7rOUXFo
        # Print program usage
        usage = r"""Usage: aoikwinwhich PROG

#/ PROG can be either name or path
aoikwinwhich notepad.exe
aoikwinwhich C:\Windows\notepad.exe

#/ PROG can be either absolute or relative
aoikwinwhich C:\Windows\notepad.exe
aoikwinwhich Windows\notepad.exe

#/ PROG can be either with or without extension
aoikwinwhich notepad.exe
aoikwinwhich notepad
aoikwinwhich C:\Windows\notepad.exe
aoikwinwhich C:\Windows\notepad"""

        print(usage)

        # 3nqHnP7
        return 1

    #
    assert len(sys.argv) == 2

    # 9m5B08H
    # Get executable name or path
    prog = sys.argv[1]

    # 8ulvPXM
    # Find executable paths
    exe_path_s = find_exe_paths(prog)

    # 5fWrcaF
    # If has found none
    if not exe_path_s:
        # 3uswpx0
        return 2
    # If has found some
    else:
        # 9xPCWuS
        # Print result
        print('\n'.join(exe_path_s))

        # 4s1yY1b
        return 0

    #
    assert 0

# 4zKrqsC
# Program entry
if __name__ == '__main__':
    sys.exit(main())
```

## AoikWinWhich-Ruby
```
#/
def find_executable(prog)
    #/ 8f1kRCu
    env_var_PATHEXT = ENV['PATHEXT']
    ## can be nil

    #/ 6qhHTHF
    #/ split into a list of extensions
    ext_s = if env_var_PATHEXT.nil?
    then []
    else env_var_PATHEXT.split(File::PATH_SEPARATOR)
    end

    #/ 2pGJrMW
    #/ strip
    ext_s = ext_s.map{|x| x.strip}

    #/ 2gqeHHl
    #/ remove empty
    ext_s = ext_s.select{|x| not x.empty?}

    #/ 2zdGM8W
    #/ convert to lowercase
    ext_s = ext_s.map{|x| x.downcase}

    #/ 2fT8aRB
    #/ uniquify
    ext_s.uniq!

    #/ 4ysaQVN
    env_var_PATH = ENV['PATH']
    ## can be nil

    #/ 6mPI0lg
    dir_path_s = if env_var_PATH.nil?
    then []
    else env_var_PATH.split(File::PATH_SEPARATOR)
    end

    #/ 5rT49zI
    #/ insert empty dir path to the beginning
    ##
    ## Empty dir handles the case that |prog| is a path, either relative or absolute.
    ## See code 7rO7NIN.
    if not dir_path_s.include? ''
        dir_path_s.unshift ''
    end

    #/ 2klTv20
    #/ uniquify
    dir_path_s.uniq!

    #/ 6bFwhbv
    exe_path_s = []

    dir_path_s.each do |dir_path|
        #/ 7rO7NIN
        #/ synthesize a path with the dir and prog
        if dir_path.empty?
            path = prog
        else
            path = File.join(dir_path, prog)
        end

        #/ 6kZa5cq
        ## assume the path has extension, check if it is an executable
        if path.end_with?(*ext_s) and File.file? path
            exe_path_s.push(path)
        end

        #/ 2sJhhEV
        ## assume the path has no extension
        ext_s.each do |ext|
            #/ 6k9X6GP
            #/ synthesize a new path with the path and the executable extension
            path_plus_ext = path + ext

            #/ 6kabzQg
            #/ check if it is an executable
            if File.file? path_plus_ext
                exe_path_s.push(path_plus_ext)
            end
        end
    end

    #/ 8swW6Av
    #/ uniquify
    exe_path_s.uniq!

    #/
    exe_path_s.map!{|x| x.sub('/', "\\")}

    #/
    return exe_path_s
end

def main
    #/ 9mlJlKg
    if ARGV.length != 1
        #/ 7rOUXFo
        #/ print program usage
        puts('Usage: aoikwinwhich PROG')
        puts('')
        puts('#/ PROG can be either name or path')
        puts('aoikwinwhich notepad.exe')
        puts('aoikwinwhich C:\Windows\notepad.exe')
        puts('')
        puts('#/ PROG can be either absolute or relative')
        puts('aoikwinwhich C:\Windows\notepad.exe')
        puts('aoikwinwhich Windows\notepad.exe')
        puts('')
        puts('#/ PROG can be either with or without extension')
        puts('aoikwinwhich notepad.exe')
        puts('aoikwinwhich notepad')
        puts('aoikwinwhich C:\Windows\notepad.exe')
        puts('aoikwinwhich C:\Windows\notepad')

        return
    end

    #/ 9m5B08H
    #/ get name or path of a program from cmd arg
    prog = ARGV[0]

    #/ 8ulvPXM
    #/ find executables
    path_s = find_executable(prog)

    #/ 5fWrcaF
    #/ has found none, exit
    if path_s.empty?
        #/ 3uswpx0
        return
    end

    #/ 9xPCWuS
    #/ has found some, output
    txt = path_s.join("\n")

    puts txt

    #/ 4s1yY1b
    return
end

if __FILE__ == $0
    main()
end
```

## AoikWinWhich-Rust
```
//
use std::ascii::AsciiExt;
use std::env;
use std::fs;
use std::process;

//
fn string_to_str(string: &String) -> &str {
    return &string;
}

//
fn string_to_lower(string: &String) -> String {
    return string.chars().map(|c| c.to_ascii_lowercase()).collect();
}

//
fn path_is_file(path: &String) -> bool {
    return match fs::metadata(path) {
        Err(_) => false,
        Ok(meta) => meta.is_file(),
    };
}

//
fn strings_uniq(item_s: &Vec<String>) -> Vec<String> {
    //
    let mut item_s_uniq : Vec<String> = Vec::new();

    //
    for item in item_s.iter() {
        if !item_s_uniq.contains(&item) {
            item_s_uniq.push(item.to_string());
        }
    }

    //
    return item_s_uniq
}

//
fn find_exe_paths(prog: &String) -> Vec<String> {
    // 8f1kRCu
    let env_pathext = match env::var("PATHEXT") {
        Ok(v) => v,
        Err(_) => "".to_string(),
    };

    // 4fpQ2RB
    if env_pathext.is_empty() {
        // 9dqlPRg
        return vec![];
    }

    // 6qhHTHF
    // Split into a list of extensions
    let mut ext_s : Vec<String> = env_pathext.split(";").map(|x| x.to_string())
        .collect();

    // 2pGJrMW
    // Strip
    ext_s = ext_s.iter().map(|x| x.trim().to_string()).collect();

    // 2gqeHHl
    // Remove empty.
    // Must be done after the stripping at 2pGJrMW.
    ext_s = ext_s.iter().filter(|x| !x.is_empty()).map(|x| x.to_string())
        .collect();

    // 2zdGM8W
    // Convert to lowercase
    ext_s = ext_s.iter().map(|x| string_to_lower(x)).collect();

    // 2fT8aRB
    // Uniquify
    ext_s = strings_uniq(&ext_s);

    // 4ysaQVN
    let env_path = match env::var("PATH") {
        Ok(v) => v,
        Err(_) => "".to_string(),
    };

    // 5gGwKZL
    let mut dir_path_s : Vec<String> =
        // 7bVmOKe
        // Go ahead with "dir_path_s" being empty
        if env_path.is_empty() {
            vec![]
        }
        else {
        // 6mPI0lg
        // Split into a list of dir paths
        env_path.split(";").map(|x| x.to_string()).collect()
        };

    // 5rT49zI
    // Insert empty dir path to the beginning.
    //
    // Empty dir handles the case that "prog" is a path, either relative or
    //  absolute. See code 7rO7NIN.
    dir_path_s.insert(0, "".to_string());

    // 2klTv20
    // Uniquify
    dir_path_s = strings_uniq(&dir_path_s);

    // 9gTU1rI
    // Check if "prog" ends with one of the file extension in "ext_s".
    //
    // "ext_s" are all in lowercase, ensured at 2zdGM8W.
    let prog_lc : &str = & string_to_lower(prog);

    let prog_has_ext = ext_s.iter().find(|ext|
        prog_lc.ends_with(string_to_str(ext))).is_some();

    // 6bFwhbv
    let mut exe_path_s : Vec<String> = Vec::new();

    for dir_path in dir_path_s.iter() {
        // 7rO7NIN
        // Synthesize a path
        let path =
            if dir_path.is_empty() {
                prog.to_owned()
            }
            else {
                format!("{}\\{}", dir_path, prog)
            };

        // 6kZa5cq
        // If "prog" ends with executable file extension
        if prog_has_ext {
            // 3whKebE
            if path_is_file(&path) {
                // 2ffmxRF
                exe_path_s.push(path.to_owned());
            }
        }

        // 2sJhhEV
        // Assume user has omitted the file extension
        for ext in ext_s.iter() {
            // 6k9X6GP
            // Synthesize a path with one of the file extensions in PATHEXT
            let path_2 = format!("{}{}", path, ext);

            // 6kabzQg
            if path_is_file(&path_2) {
                // 7dui4cD
                exe_path_s.push(path_2);
            }
        }
    }

    // 8swW6Av
    // Uniquify
    exe_path_s = strings_uniq(&exe_path_s);

    // 7y3JlnS
    return exe_path_s;
}

// 4zKrqsC
// Program entry
fn main() {
    //
    let arg_s: Vec<_> = env::args().collect();

    // 9mlJlKg
    // If not exactly one command argument is given
    if arg_s.len() != 2 {
        // 7rOUXFo
        // Print program usage
        let usage = "Usage: aoikwinwhich PROG

#/ PROG can be either name or path
aoikwinwhich notepad.exe
aoikwinwhich C:\\Windows\\notepad.exe

#/ PROG can be either absolute or relative
aoikwinwhich C:\\Windows\\notepad.exe
aoikwinwhich Windows\\notepad.exe

#/ PROG can be either with or without extension
aoikwinwhich notepad.exe
aoikwinwhich notepad
aoikwinwhich C:\\Windows\\notepad.exe
aoikwinwhich C:\\Windows\\notepad";

        println!("{}", usage);

        // 3nqHnP7
        process::exit(1);
    }

    // 9m5B08H
    // Get executable name or path
    let ref prog = arg_s[1];

    // 8ulvPXM
    // Find executable paths
    let ref exe_path_s = find_exe_paths(prog);

    // 5fWrcaF
    // If has found none
    if arg_s.len() == 0 {
        // 3uswpx0
        process::exit(2);
    }
    else {
        // 9xPCWuS
        // Print result
        println!("{}", exe_path_s.connect("\n"));

        // 4s1yY1b
        process::exit(0);
    }
}
```

## AoikWinWhich-Scala
```
//
package aoikwinwhich
import java.io.File
import java.nio.file.Files
import java.nio.file.Paths
import scala.collection.mutable.ListBuffer

//
object AoikWinWhich {

    def find_executable(prog: String): List[String] = {
        // 8f1kRCu
        val env_var_PATHEXT = System.getenv("PATHEXT")
        /// can be null

        // 6qhHTHF
        // split into a list of extensions
        var ext_s =
            if (env_var_PATHEXT == null)
                List[String]()
            else
                env_var_PATHEXT.split(File.pathSeparator).toList

        // 2pGJrMW
        // strip
        ext_s = ext_s.map(_.trim)

        // 2gqeHHl
        // remove empty
        ext_s = ext_s.filter(_ != "")

        // 2zdGM8W
        // convert to lowercase
        ext_s = ext_s.map(_.toLowerCase)

        // 2fT8aRB
        // uniquify
        ext_s = ext_s.distinct
        /// |distinct| keeps the original order.

        // 4ysaQVN
        val env_var_PATH = System.getenv("PATH")
        /// can be null

        // 6mPI0lg
        var dir_path_s =
            if (env_var_PATH == null)
                ListBuffer[String]()
            else
                env_var_PATH.split(File.pathSeparator).to[ListBuffer]

        // 5rT49zI
        // insert empty dir path to the beginning
        //
        // Empty dir handles the case that |prog| is a path, either relative or
        //  absolute. See code 7rO7NIN.
        "" +=: dir_path_s

        // 2klTv20
        // uniquify
        dir_path_s = dir_path_s.distinct
        /// |distinct| keeps the original order.

        // 6bFwhbv
        val exe_path_s = ListBuffer[String]()

        for (dir_path <- dir_path_s) {
            // 7rO7NIN
            // synthesize a path with the dir and prog
            val path =
                if (dir_path == "")
                    prog
                else
                    Paths.get(dir_path, prog).toString

            // 6kZa5cq
            // assume the path has extension, check if it is an executable
            if (ext_s.exists(path.endsWith _)) {
                if (Files.isRegularFile(Paths.get(path))) {
                    exe_path_s += path
                }
            }

            // 2sJhhEV
            // assume the path has no extension
            for (ext <- ext_s) {
                // 6k9X6GP
                // synthesize a new path with the path and the executable extension
                val path_plus_ext = path + ext

                // 6kabzQg
                // check if it is an executable
                if (Files.isRegularFile(Paths.get(path_plus_ext))) {
                    exe_path_s += path_plus_ext
                }
            }
        }

        //
        return exe_path_s.toList
    }

    def main(args: Array[String]) {
        // 9mlJlKg
        // check if one cmd arg is given
        if (args.length != 1) {
            // 7rOUXFo
            // print program usage
            println("Usage: aoikwinwhich PROG")
            println("")
            println("#/ PROG can be either name or path")
            println("aoikwinwhich notepad.exe")
            println("aoikwinwhich C:\\Windows\\notepad.exe")
            println("")
            println("#/ PROG can be either absolute or relative")
            println("aoikwinwhich C:\\Windows\\notepad.exe")
            println("aoikwinwhich Windows\\notepad.exe")
            println("")
            println("#/ PROG can be either with or without extension")
            println("aoikwinwhich notepad.exe")
            println("aoikwinwhich notepad")
            println("aoikwinwhich C:\\Windows\\notepad.exe")
            println("aoikwinwhich C:\\Windows\\notepad")

            // 3nqHnP7
            return
        }

        // 9m5B08H
        // get name or path of a program from cmd arg
        val prog = args(0)

        // 8ulvPXM
        // find executables
        val path_s = find_executable(prog)

        // 5fWrcaF
        // has found none, exit
        if (path_s.size == 0) {
            // 3uswpx0
            return
        }

        // 9xPCWuS
        // has found some, output
        val txt = path_s.mkString("\n")

        println(txt)

        //
        return
    }
}
```

## AoikWinWhich-Scheme
```
;
#lang scheme

;
(define (string-endswith str end)
  (let ([str_len ; be
    (string-length str)
    ]
    [end_len ; be
    (string-length end)
    ])
    ; then
    (if (< str_len end_len)
      ; then
      #f
      ; else
      (equal? end (substring str (- str_len end_len)))
    )
  )
)

;
(define (find_exe_paths prog)
  ; 8f1kRCu
  (let ([env_pathext (getenv "PATHEXT")])
  ; in

    ; 4fpQ2RB
    (if (not env_pathext)
      ; then
      ; 9dqlPRg
      ; Return
      '()
      ; else
      ; 6qhHTHF
      ; Split into a list of extensions
      (let ([ext_s
        ; be
        (string-split env_pathext ";")
        ])
        ; in

        ; 2pGJrMW
        ; Strip
        (let ([ext_s
          ; be
          (for/list ([ext ext_s]) (string-trim ext))
          ])
          ; in

          ; 2gqeHHl
          ; Remove empty.
          ; Must be done after the stripping at 2pGJrMW.
          (let ([ext_s
            ; be
            (filter (lambda (x) (not (equal? x ""))) ext_s)
            ])
            ; in

            ; 2zdGM8W
            ; Convert to lowercase
            (let ([ext_s
              ; be
              (for/list ([ext ext_s]) (string-downcase ext))
              ])
              ; in

              ; 2fT8aRB
              ; Uniquify
              (let ([ext_s
                ; be
                (remove-duplicates ext_s)
                ])
                ; in

                ; 4ysaQVN
                (let ([env_path
                  ; be
                  (getenv "PATH")])
                  ; in

                  ;
                  (let ([dir_path_s
                    ; be
                    ; 5gGwKZL
                    (if (not env_path)
                      ; then
                      '()
                      ; else
                      ; 6mPI0lg
                      ; Split into a list of extensions
                      (string-split env_path ";")
                    )
                    ])
                    ; in
                    ; 5rT49zI
                    ; Insert empty dir path to the beginning.
                    ;
                    ; Empty dir handles the case that "prog" is a path,
                    ; either relative or absolute. See code 7rO7NIN.
                    (let ([dir_path_s
                      ; be
                      (cons "" dir_path_s)
                      ])
                      ; in

                      ; 2klTv20
                      ; Uniquify
                      (let ([dir_path_s
                        ; be
                        (remove-duplicates dir_path_s)
                        ])
                        ; in

                        ; 9gTU1rI
                        ; Check if "prog" ends with one of the file
                        ; extension in "ext_s".
                        ;
                        ; "ext_s" are all in lowercase, ensured at 2zdGM8W.
                        (let ([prog_lc
                          ; be
                          (string-downcase prog)
                          ])
                          ; in
                          (let ([prog_has_ext
                            ; be
                            (findf (lambda (ext) (string-endswith prog_lc ext))
                              ext_s)
                            ])
                            ; in

                            ; 6bFwhbv
                            (let ([exe_path_s
                              ; be
                              '()
                              ])
                              ; in
                              (begin
                                (for ([dir_path dir_path_s])
                                  ; 7rO7NIN
                                  ; Synthesize a path
                                  (let ([path ; be
                                    (if (equal? dir_path "")
                                        ; then
                                        prog
                                        ;else
                                        (string-join
                                          (list dir_path "\\" prog) ""
                                        )
                                    )
                                    ])
                                    ; in
                                    (begin
                                      ; 6kZa5cq
                                      ; If "prog" ends with executable file
                                      ; extension
                                      (if prog_has_ext
                                          ; then
                                          ; 3whKebE
                                          (if (file-exists? path)
                                            ; then
                                            ; 2ffmxRF
                                            ; Use "cons" so remember to
                                            ; reverse at 2qScrZs
                                            (set! exe_path_s
                                              (cons path exe_path_s)
                                            )
                                            ; else
                                            #f
                                            )
                                          ; else
                                          #f
                                          )

                                      ; 2sJhhEV
                                      ; Assume user has omitted the file
                                      ; extension
                                      (for ([ext ext_s])
                                        ; 6k9X6GP
                                        ; Synthesize a path with one of the
                                        ; file extensions in PATHEXT
                                        (let ([path
                                          ; be
                                          (string-append path ext)
                                          ])
                                          ; in

                                          ; 6kabzQg
                                          (if (file-exists? path)
                                              ; then
                                              ; 7dui4cD
                                              (set! exe_path_s (cons path exe_path_s))
                                              ; Use "cons" so remember to
                                              ; reverse at 2qScrZs

                                              ; else
                                              #f
                                              )
                                          )
                                        )
                                      )
                                    )
                                  )

                                ; Reverse due to "cons" at 2ffmxRF and
                                ; 7dui4cD
                                (let ([exe_path_s
                                  ; be
                                  (reverse exe_path_s)
                                  ])
                                  ; in

                                  ; 8swW6Av
                                  ; Uniquify
                                  (let ([exe_path_s
                                    ; be
                                    (remove-duplicates exe_path_s)
                                    ])
                                    ; in

                                    ; 2qScrZs
                                    ; Return
                                    exe_path_s
                                  )
                                )
                              )
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  )
)

;
(define (main)
  ;
  (let ([cmd_len ; be
         (vector-length (current-command-line-arguments))
         ])

    ; 9mlJlKg
    ; If not exactly one command argument is given
    (if (not (equal? cmd_len 1))
        ; then
        (begin
          ; 7rOUXFo
          ; Print program usage
          (printf "Usage: aoikwinwhich PROG

#/ PROG can be either name or path
aoikwinwhich notepad.exe
aoikwinwhich C:\\Windows\\notepad.exe

#/ PROG can be either absolute or relative
aoikwinwhich C:\\Windows\\notepad.exe
aoikwinwhich Windows\\notepad.exe

#/ PROG can be either with or without extension
aoikwinwhich notepad.exe
aoikwinwhich notepad
aoikwinwhich C:\\Windows\\notepad.exe
aoikwinwhich C:\\Windows\\notepad
")

          ; 3nqHnP7
          ; Exit
          1
          )
        ; else
        ; 9m5B08H
        ; Get executable name or path
        (let ([prog ; be
               (vector-ref (current-command-line-arguments) 0)
               ])
          ; then
          ; 8ulvPXM
          ; Find executable paths
          (let ([exe_path_s ; be
                 (find_exe_paths prog)
                 ])
            ; 5fWrcaF
            ; Has found none
            (if (empty? exe_path_s)
                ; then
                ; 3uswpx0
                ; Exit
                2
                ; else
                (begin
                  ; 9xPCWuS
                  ; Print result
                  (printf (string-append (string-join exe_path_s "\n") "\n"))

                  ; 4s1yY1b
                  ; Exit
                  0
                  )
                )
            )
          )
        )
    )
  )

; 4zKrqsC
; Program entry
(exit (main))
```

## AoikWinWhich-Tcl
```
#/

proc ret {x} {
    return $x
}

#/ Modified from |http://stackoverflow.com/a/3235303|
##
## This proc returns a func-like list with |apply| being first item, and
##  |apply|'s first arg (i.e. func definition) as second item.
## When the result list is expanded using syntax |{*}$f|, |apply| becomes the
##  command, it will perform the func call. Any following args become args of
##  the func call.
##
## Syntax for creating a func-like list:
## '''
## set fl [func {x} {expr $x > 0}]
## '''
##
## Syntax for calling a func-like list:
## '''
## {*}$fl $arg
## '''
proc func {args body} {
    set ns [uplevel 1 namespace current]
    return [list ::apply [list $args $body $ns]]
}

proc any {item_s funcl} {
    foreach item $item_s {
        if {[{*}$funcl $item] != 0} {
            return 1
        }
    }
    return 0
}

#/ Modified from |http://stackoverflow.com/a/20376860|
proc uniq item_s {
    set item_d [dict create]

    foreach item $item_s {
        dict set item_d $item 1
    }

    return [dict keys $item_d]
}

proc endswith {hay ndl} {
    set hay_len [string length $hay]

    set ndl_len [string length $ndl]

    if {[expr $hay_len < $ndl_len]} {
        return 0
    } else {
        if {[expr [string last $ndl $hay] == [expr $hay_len - $ndl_len]]} {
            return 1
        } else {
            return 0
        }
    }
}

proc find_executable prog {
    #/ 8f1kRCu
    set env_var_PATHEXT [
        if {[info exists ::env(PATHEXT)]} {
            ret $::env(PATHEXT)
        } else {
            ret {}
        }
    ]

    #/ 6qhHTHF
    #/ split into a list of extensions
    set ext_s [
        if {[string length $env_var_PATHEXT] == 0} {
            ret [list]
        } else {
            ret [split $env_var_PATHEXT ";"]
        }
    ]

    #/ 2pGJrMW
    #/ strip
    set ext_s [lmap x $ext_s {set x [string trim $x]}]

    #/ 2gqeHHl
    #/ remove empty
    set ext_s [lmap x $ext_s {
        if {[string length $x] == 0} continue
        set x
        }
    ]

    #/ 2zdGM8W
    #/ convert to lowercase
    set ext_s [lmap x $ext_s {set x [string tolower $x]}]

    #/ 2fT8aRB
    #/ uniquify
    set ext_s [uniq $ext_s]

    #/ 4ysaQVN
    set env_var_PATH [
        if {[info exists ::env(PATH)]} {
            ret $::env(PATH)
        } else {
            ret {}
        }
    ]

    #/ 6mPI0lg
    set dir_path_s [
        if {[string length $env_var_PATH] == 0} {
            ret [list]
        } else {
            ret [split $env_var_PATH ";"]
        }
    ]

    #/ 5rT49zI
    #/ insert empty dir path to the beginning
    ##
    ## Empty dir handles the case that |prog| is a path, either relative or
    ##  absolute. See code 7rO7NIN.
    set dir_path_s [linsert $dir_path_s 0 ""]

    #/ 2klTv20
    #/ uniquify
    set dir_path_s [uniq $dir_path_s]

    #/
    set prog_lc [string tolower $prog]

    set func_body "endswith $prog_lc \$ext"
    ## Must substitute |$prog_lc| to its value here
    ##  because |func| below does not support closure.

    set prog_has_ext [any $ext_s [func {ext} $func_body]]

    #/ 6bFwhbv
    set exe_path_s [list]

    foreach dir_path $dir_path_s {
        #/ 7rO7NIN
        #/ synthesize a path with the dir and prog
        set path [
            if {$dir_path == ""} {
                ret $prog
            } else {
                ret [string cat $dir_path [file separator] $prog]
            }
        ]

        #/ 6kZa5cq
        ## assume the path has extension, check if it is an executable
        if {$prog_has_ext && [file isfile $path]} {
            set exe_path_s [lappend exe_path_s $path]
        }

        #/ 2sJhhEV
        ## assume the path has no extension
        foreach ext $ext_s {
            #/ 6k9X6GP
            #/ synthesize a new path with the path and the executable extension
            set path_plus_ext [string cat $path $ext]

            #/ 6kabzQg
            #/ check if it is an executable
            if {[file isfile $path_plus_ext]} {
                set exe_path_s [lappend exe_path_s $path_plus_ext]
            }
        }
    }

    #/ 8swW6Av
    #/ uniquify
    set exe_path_s [uniq $exe_path_s]

    #/
    return $exe_path_s
}

proc main {} {
    #/ 9mlJlKg
    if {[llength $::argv] != 1} {
        #/ 7rOUXFo
        #/ print program usage
        puts {Usage: aoikwinwhich PROG}
        puts {}
        puts {#/ PROG can be either name or path}
        puts {aoikwinwhich notepad.exe}
        puts {aoikwinwhich C:\Windows\notepad.exe}
        puts {}
        puts {#/ PROG can be either absolute or relative}
        puts {aoikwinwhich C:\Windows\notepad.exe}
        puts {aoikwinwhich Windows\notepad.exe}
        puts {}
        puts {#/ PROG can be either with or without extension}
        puts {aoikwinwhich notepad.exe}
        puts {aoikwinwhich notepad}
        puts {aoikwinwhich C:\Windows\notepad.exe}
        puts {aoikwinwhich C:\Windows\notepad}

        #/ 3nqHnP7
        return
    }

    #/ 9m5B08H
    #/ get name or path of a program from cmd arg
    set prog [lindex $::argv 0]

    #/ 8ulvPXM
    #/ find executables
    set path_s [find_executable $prog]

    #/ 5fWrcaF
    #/ has found none, exit
    if {[llength $path_s] == 0} {
        #/ 3uswpx0
        return
    }

    #/ 9xPCWuS
    #/ has found some, output
    set txt [join $path_s "\n"]

    puts $txt

    #/ 4s1yY1b
    return
}

main
```

## AoikWinWhich-VB.NET
```
''
Imports System.IO

''
Module AoikWinWhich

    Function find_executable(ByVal prog As String) As List(Of String)
        '' 8f1kRCu
        Dim env_var_PATHEXT = Environment.GetEnvironmentVariable("PATHEXT")
        ''# can be Nothing

        '' 6qhHTHF
        '' split into a list of extensions
        Dim ext_s = If(env_var_PATHEXT = Nothing,
                New List(Of String)(),
                New List(Of String)(env_var_PATHEXT.Split(Path.PathSeparator))
        )

        '' 2pGJrMW
        '' strip
        ext_s = ext_s.Select(Function(x) x.Trim()).ToList()

        '' 2gqeHHl
        '' remove empty
        ext_s = ext_s.Where(Function(x) x <> "").ToList()

        '' 2zdGM8W
        '' convert to lowercase
        ext_s = ext_s.Select(Function(x) x.ToLower()).ToList()

        '' 2fT8aRB
        '' uniquify
        ext_s = ext_s.Distinct().ToList()

        '' 4ysaQVN
        Dim env_var_PATH = Environment.GetEnvironmentVariable("PATH")
        ''# can be Nothing

        Dim dir_path_s = If(env_var_PATH = Nothing,
                New List(Of String)(),
                New List(Of String)(env_var_PATH.Split(Path.PathSeparator))
        )

        '' 5rT49zI
        '' insert empty dir path to the beginning
        ''
        '' Empty dir handles the case that |prog| is a path, either relative or
        ''  absolute. See code 7rO7NIN.
        dir_path_s.Insert(0, "")

        '' 2klTv20
        '' uniquify
        dir_path_s = dir_path_s.Distinct().ToList()

        ''
        Dim prog_lc = prog.ToLower()

        Dim prog_has_ext = ext_s.Any(Function(ext) prog_lc.EndsWith(ext))

        '' 6bFwhbv
        Dim exe_path_s = New List(Of String)

        For Each dir_path In dir_path_s
            '' 7rO7NIN
            '' synthesize a path with the dir and prog
            Dim file_path = If(dir_path = "",
                    prog,
                    Path.Combine(dir_path, prog)
            )

            '' 6kZa5cq
            '' assume the path has extension, check if it is an executable
            If prog_has_ext And File.Exists(file_path) Then
                exe_path_s.Add(file_path)
            End If

            '' 2sJhhEV
            '' assume the path has no extension
            For Each ext In ext_s
                '' 6k9X6GP
                '' synthesize a new path with the path and the executable extension
                Dim path_plus_ext = file_path + ext

                '' 6kabzQg
                '' check if it is an executable
                If File.Exists(path_plus_ext) Then
                    exe_path_s.Add(path_plus_ext)
                End If
            Next
        Next

        '' 8swW6Av
        '' uniquify
        exe_path_s = exe_path_s.Distinct().ToList()

        ''
        Return exe_path_s
    End Function

    Sub Main()
        '' 9mlJlKg
        Dim args = Environment.GetCommandLineArgs()
        ''# first arg is this program's path.

        If args.Length <> 2 Then
            '' 7rOUXFo
            '' print program usage
            Console.WriteLine("Usage: aoikwinwhich PROG")
            Console.WriteLine("")
            Console.WriteLine("#/ PROG can be either name or path")
            Console.WriteLine("aoikwinwhich notepad.exe")
            Console.WriteLine("aoikwinwhich C:\Windows\notepad.exe")
            Console.WriteLine("")
            Console.WriteLine("#/ PROG can be either absolute or relative")
            Console.WriteLine("aoikwinwhich C:\Windows\notepad.exe")
            Console.WriteLine("aoikwinwhich Windows\notepad.exe")
            Console.WriteLine("")
            Console.WriteLine("#/ PROG can be either with or without extension")
            Console.WriteLine("aoikwinwhich notepad.exe")
            Console.WriteLine("aoikwinwhich notepad")
            Console.WriteLine("aoikwinwhich C:\Windows\notepad.exe")
            Console.WriteLine("aoikwinwhich C:\Windows\notepad")

            '' 3nqHnP7
            Return
        End If

        '' 9m5B08H
        '' get name or path of a program from cmd arg
        Dim prog = args(1)

        '' 8ulvPXM
        '' find executables
        Dim path_s = find_executable(prog)

        '' 5fWrcaF
        '' has found none, exit
        If path_s.Count = 0 Then
            '' 3uswpx0
            Return
        End If

        '' 9xPCWuS
        '' has found some, output
        Dim txt = String.Join(Environment.NewLine, path_s)

        Console.WriteLine(txt)

        '' 4s1yY1b
        Return
    End Sub

End Module
```

## AoikWinWhich-Xtend
```
//
package aoikwinwhich

import java.io.File
import java.nio.file.Files
import java.nio.file.Paths
import java.util.Arrays
import java.util.LinkedHashSet
import java.util.LinkedList
import java.util.List

//
class AoikWinWhich {

    def static List<String> find_executable(String prog) {
        // 8f1kRCu
        val env_var_PATHEXT = System.getenv("PATHEXT")
        /// can be null

        // 6qhHTHF
        // split into a list of extensions
        var ext_s =
            if (env_var_PATHEXT == null)
                newLinkedList
            else
                Arrays.asList(env_var_PATHEXT.split(File.pathSeparator))

        // 2pGJrMW
        // strip
        ext_s = ext_s.map[ x | x.trim() ].toList()

        // 2gqeHHl
        // remove empty
        ext_s = ext_s.filter[ x | x != "" ].toList()

        // 2zdGM8W
        // convert to lowercase
        ext_s = ext_s.map[ x | x.toLowerCase() ].toList()

        // 2fT8aRB
        // uniquify
        ext_s = new LinkedList(new LinkedHashSet(ext_s))
        /// LinkedHashSet keeps the original order.

        // 4ysaQVN
        val env_var_PATH = System.getenv("PATH")
        /// can be null

        // 6mPI0lg
        var dir_path_s =
            if (env_var_PATH == null)
                newLinkedList
            else
                new LinkedList(Arrays.asList(env_var_PATH.split(File.pathSeparator)))

        // 5rT49zI
        // insert empty dir path to the beginning
        //
        // Empty dir handles the case that |prog| is a path, either relative or
        //  absolute. See code 7rO7NIN.
        dir_path_s.add(0, "")

        // 2klTv20
        // uniquify
        dir_path_s = new LinkedList(new LinkedHashSet(dir_path_s))
        /// LinkedHashSet keeps the original order.

        //
        val prog_lc = prog.toLowerCase()

        val prog_has_ext = ext_s.exists[ ext | prog_lc.endsWith(ext) ]

        // 6bFwhbv
        var exe_path_s = new LinkedList<String>()

        for (String dir_path : dir_path_s) {
            // 7rO7NIN
            // synthesize a path with the dir and prog
            val path =
                if (dir_path == "")
                    prog
                else
                    Paths.get(dir_path, prog).toString()

            // 6kZa5cq
            // assume the path has extension, check if it is an executable
            if (prog_has_ext && Files.isRegularFile(Paths.get(path))) {
                 exe_path_s.add(path)
            }

            // 2sJhhEV
            // assume the path has no extension
            for (String ext : ext_s) {
                // 6k9X6GP
                // synthesize a new path with the path and the executable extension
                val path_plus_ext = path + ext

                // 6kabzQg
                // check if it is an executable
                if (Files.isRegularFile(Paths.get(path_plus_ext))) {
                    exe_path_s.add(path_plus_ext)
                }
            }
        }

        // 8swW6Av
        // uniquify
        exe_path_s = new LinkedList(new LinkedHashSet(exe_path_s))
        /// LinkedHashSet keeps the original order.

        //
        return exe_path_s
    }

    def static void main(String[] args) {
        // 9mlJlKg
        // check if one cmd arg is given
        if (args.length != 1) {
            // 7rOUXFo
            // print program usage
            println('Usage: aoikwinwhich PROG')
            println('')
            println('#/ PROG can be either name or path')
            println('aoikwinwhich notepad.exe')
            println('aoikwinwhich C:\\Windows\\notepad.exe')
            println('')
            println('#/ PROG can be either absolute or relative')
            println('aoikwinwhich C:\\Windows\\notepad.exe')
            println('aoikwinwhich Windows\\notepad.exe')
            println('')
            println('#/ PROG can be either with or without extension')
            println('aoikwinwhich notepad.exe')
            println('aoikwinwhich notepad')
            println('aoikwinwhich C:\\Windows\\notepad.exe')
            println('aoikwinwhich C:\\Windows\\notepad')

            // 3nqHnP7
            return
        }

        // 9m5B08H
        // get name or path of a program from cmd arg
        val prog = args.get(0)

        // 8ulvPXM
        // find executables
        val path_s = find_executable(prog)

        // 5fWrcaF
        // has found none, exit
        if (path_s.size() == 0) {
            // 3uswpx0
            return
        }

        // 9xPCWuS
        // has found some, output
        val txt = String.join("\n", path_s)

        println(txt)

        // 4s1yY1b
        return
    }
}
```
