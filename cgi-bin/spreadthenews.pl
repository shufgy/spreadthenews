#!/usr/bin/perl

use strict;
use warnings;

use CGI;
use JSON;

my $q = CGI->new;
my $file = '/home/huggie/tmp/spreadthenews.log';


sub error($) {
	my $err = shift;
	print "Content-Type: text/html\n";
	print "Access-Control-Allow-Origin: *\n\n";
	
	print "<h1>Error</h1>\n";
	print "<p>" . $err . "</p>\n";
	exit;
}

if ($q->param('data')) {
	# deal with POST

	my $data = $q->param('data');

	# FIXME Should verify data sanity etc

	my $list = decode_json $data;

	# dedupe (not Perlish but works)
	my $dlist;
	my %a;
	foreach my $item (@$list) {
		if (!$a{$item}) {
			push @$dlist, $item;
		}
		$a{$item}++;
	}

	open(OUT, ">$file");
	print OUT encode_json $dlist;
	close(OUT);

	print "Content-Type: text/html\n";
	print "Access-Control-Allow-Origin: *\n\n";

	print "Thanks!\n";
	exit;
} elsif ($q->param('getlist')) {
	my $user =  $q->param('getlist');
	if ($user ne 'shufgy' and $user ne 'stephenfry') {
		error("No user known by that name!\n");	
	}

	my $data;
	if ($user eq 'stephenfry') {
		$data = '["http://www.theguardian.com/technology/2011/oct/12/iphone-4s-stephen-fry-review-steve-jobs","http://www.theguardian.com/sport/2013/dec/02/tom-daley-in-relationship-with-man","http://www.theguardian.com/world/2013/nov/14/gay-briton-uganda-sex-images-jail","http://www.theguardian.com/books/booksblog/2013/nov/20/qi-quiz-facts-book-favourites"]';
	} else {
		open(IN, $file);
		{
			undef $/;
			$data = <IN>;
		}
		close(IN);
	}

	print "Content-Type: application/json\n";
	print "Access-Control-Allow-Origin: *\n\n";
	print $data;
} else {
	print "Content-Type: text/html\n";
	print "Access-Control-Allow-Origin: *\n\n";
	print "<h1>Tsk</h1>\n";
	print "<p>Nothing here for the curious</p>\n";
}
