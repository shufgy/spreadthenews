#!/usr/bin/perl

use strict;
use warnings;

use CGI;

my $q = CGI->new;
my $file = '/home/huggie/tmp/spreadthenews.log';


sub error($) {
	my $err = shift;
	print "Content-Type: text/html\n\n";
	
	print "<h1>Error</h1>\n";
	print "<p>" . $err . "</p>\n";
	exit;
}

if ($q->param('data')) {
	# deal with POST
	open(OUT, ">$file");
	print OUT $q->param('data');
	close(OUT);

	print "Content-Type: text/html\n";
	print "Access-Control-Allow-Origin: *\n\n";

	print "Thanks!\n";
	exit;
} elsif ($q->param('getlist')) {
	my $user =  $q->param('getlist');
	if ($user ne 'shufgy') {
		error("No user known by that name!\n");	
	}

	my $data;
	open(IN, $file);
	{
		undef $/;
		$data = <IN>;
	}
	close(IN);

	print "Content-Type: application/json\n\n";
	print $data;
} else {
	print "Content-Type: text/html\n\n";
	print "<h1>Tsk</h1>\n";
	print "<p>Nothing here for the curious</p>\n";
}
