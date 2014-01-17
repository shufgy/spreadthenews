#!/usr/bin/perl

use strict;
use warnings;

use CGI;

my $q = CGI->new;

if ($q->param('data')) {
	# deal with POST
	open(OUT, ">/home/huggie/tmp/spreadthenews.log");
	print OUT $p->param('data');
	close(OUT);

	print "Content-Type: text/html\n";
	print "Access-Control-Allow-Origin: *\n\n";

	print "Thanks!\n";
	exit;
}


