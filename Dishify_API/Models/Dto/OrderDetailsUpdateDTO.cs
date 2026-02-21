using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Dishify_API.Models.Dto
{
    public class OrderDetailsUpdateDTO
    {
         [Required]        
         
           public int OrderDetailId { get; set; }

     
     
 [Required]      
 [Range(1,5)]
 public int Rating { get; set;}
        
    }
}