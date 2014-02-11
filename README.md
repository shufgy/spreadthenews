spreadthenews
=============

A hack day project to allow curated lists on the side of the response Guardian site

This is a hack day project and my first Chrome extension.
It includes some Perl CGI just so I can be laughed at by the Guardian developers.

I should point out that before this project I didn't really understand JavaScript which if you look at it will become apparent :)

Premise
=======

The idea was that the Guardian has great content but sometimes people come in and don't know where to go next.
If I could follow say my friends or famous people who had curated lists that might help drive traffic around the site more.

What I finished
===============

I made a chrome extension that looks at a next-gen cookie for your history and allows you post your entire history up to a Perl script that stores it (just for one user) and then can parrot it back to you with extra info from the content-api.
It then displays the list you've chosen on the right of articles.

What it should also do
======================

It needs to:

 * cope with multiple users
 * integrate with identity
 * have some interface to store whose lists you want to follow
 * allow people to pick and choose from what they've visited so they can properly curate a list
 * allow people to move things around inside the list
 * allow people to share their list
 
