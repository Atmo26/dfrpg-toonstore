function validate()
{
	var valid = /^[A-Za-z0-9_-]+$/.test( $('#canon_name').val() );
	if( !valid ){
		if( $('div.error').length == 0 )
			$('<div class="content-block"><div class="error"><p>That short name is invalid.</p></div></div>').prependTo( $('.content') );
		else
			$('div.error>p').text('That short name is invalid');
	}
	return valid;
}

function generateSlug(fullName)
{
	var name = $(fullName).val();
	var slug = name.split(' ').pop().toLowerCase().replace(/[^\w]/g, '_');
	$('#canon_name').val(slug);
}

function prepopulateCopy()
{
	var match = /[?&]copy=([^&]+)/.exec(window.location.search);
	if(match){
		$.getJSON('/'+match[1]+'/json', function(data,status,xhr)
		{
			$('input#name').val(data.name);
			$('input#canon_name').val( match[1].split('/')[1] );
			$('input#concept').val(data.aspects.high_concept.name);
			$('input#copy').val(match[1]);

			$('<div class="info" style="margin-bottom: 15px;">Duplicating character:<br/><strong>'+data.name+'</strong><br/>('+match[1]+')</div>').prependTo('.titledbox .inner');
		});
	}
}

$(prepopulateCopy);
