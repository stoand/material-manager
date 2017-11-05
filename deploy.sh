npm run build &&
ssh be "rm -rf /home/entitygr/public_html/admin_panel /home/entitygr/admin_panel_backend" &&
scp -r dist/ be:~/public_html/admin_panel &&
scp proxy.php be:~/public_html/admin_panel
ssh be "chmod 775 /home/entitygr/public_html/admin_panel -R"
scp -r  backend be:~/admin_panel_backend
scp -r  package.json be:~/admin_panel_backend
ssh be "source ~/.bashrc; cd ~/admin_panel_backend && npm i && forever stopall && forever start backend.js"

## DONT FORGET TO RECREATE .env file!