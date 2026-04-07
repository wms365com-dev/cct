@echo off
setlocal EnableExtensions

cd /d "%~dp0"

if /I "%~1"=="--dry-run" (
  set "DRY_RUN=1"
  shift
)

where git >nul 2>nul
if errorlevel 1 (
  echo Git is not installed or not on PATH.
  exit /b 1
)

for /f "delims=" %%i in ('git rev-parse --show-toplevel 2^>nul') do set "REPO_ROOT=%%i"
if not defined REPO_ROOT (
  echo This folder is not inside a Git repository.
  exit /b 1
)

cd /d "%REPO_ROOT%"

for /f "delims=" %%i in ('git rev-parse --abbrev-ref HEAD 2^>nul') do set "BRANCH=%%i"
if not defined BRANCH (
  echo Could not detect the current Git branch.
  exit /b 1
)

for /f "delims=" %%i in ('git remote get-url origin 2^>nul') do set "REMOTE_URL=%%i"
if not defined REMOTE_URL (
  echo Git remote "origin" is not configured.
  exit /b 1
)

set "COMMIT_MSG="
:collect_args
if "%~1"=="" goto args_done
if defined COMMIT_MSG (
  set "COMMIT_MSG=%COMMIT_MSG% %~1"
) else (
  set "COMMIT_MSG=%~1"
)
shift
goto collect_args
:args_done

if not defined COMMIT_MSG (
  set /p COMMIT_MSG=Enter commit message ^(leave blank for Update Maple Mentor^): 
)
if not defined COMMIT_MSG set "COMMIT_MSG=Update Maple Mentor"

echo.
echo Repo   : %REPO_ROOT%
echo Branch : %BRANCH%
echo Remote : %REMOTE_URL%
echo Commit : %COMMIT_MSG%
echo.

if defined DRY_RUN (
  echo [Dry run] git add .
  echo [Dry run] git commit -m "%COMMIT_MSG%"
  echo [Dry run] git push origin %BRANCH%
  exit /b 0
)

git add .
if errorlevel 1 goto :error

git diff --cached --quiet
if errorlevel 1 (
  git commit -m "%COMMIT_MSG%"
  if errorlevel 1 goto :error
) else (
  echo No file changes to commit. Continuing with push...
)

git push origin %BRANCH%
if errorlevel 1 goto :error

echo.
echo Push complete.
exit /b 0

:error
echo.
echo Push failed. Review the Git output above.
exit /b 1
