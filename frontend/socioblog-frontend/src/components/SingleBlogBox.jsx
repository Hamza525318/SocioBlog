import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';



const ExpandMore = styled((props) => {



  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));




function SingleBlogBox({key,blog_id,title,content,image,createdAt}) {
   
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  const textContent = tempDiv.textContent || tempDiv.innerText;
  const words = textContent.split(/\s+/);
  const first40Words = words.slice(0, 40).join(' ');

  return (
    <Card style={{"margin":"10px 0px","width":"345px"}}>
      <CardHeader
        avatar={
          <Avatar style={{"backgroundColor":"#FF7871"}} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={title}
        subheader= {new Date(parseInt(createdAt)).toLocaleDateString()}
      />
      {
       image &&
      <CardMedia
        component="img"
        width="150"
        height="150"
        image={image}
        alt="Paella dish"
      />
     }  
      <CardContent>
        <div>
          { 
            <>
            <p dangerouslySetInnerHTML={{__html:first40Words+`....`}}></p>
            <Link to={`/single-blog/?blog_id=${blog_id}`}>read More...</Link>
            </>
          }
        </div>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" style={{"display":"flex"}}>
          <FavoriteIcon style={{"color":"#FF7871"}}  />
          <p className='text-sm'>12000 likes</p>
        </IconButton>
       </CardActions>
    </Card>
  );
}

export default SingleBlogBox