
use strict;
use warnings;

use File::Basename;

sub usage()
{
   die("Usage <index html file> <output file>\n");
}

my $INDEX_FILE = $ARGV[0] or usage();
my $OUT_FILE   = $ARGV[1] or usage();


my $fid;

open($fid, "<". $INDEX_FILE ) or die ("Cannot open '$INDEX_FILE'");

my $path = dirname ($INDEX_FILE);
print "PATH: $path \n";
 
my $file_list = [];

while (my $line = <$fid>)
{
   if ( $line =~ /javascript.*\s+src\s*=\s*\"([^"]+)\"/)
   {
      print "Got file: '$1'\n";
      push(@$file_list, $path."/".$1 );
   }
}
my $str = join(" ", @$file_list );
my $cmd = "shrinksafe ".$str;

print "DOING: $cmd \n";

system($cmd .">".$OUT_FILE );