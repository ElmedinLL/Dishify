using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Dishify_API.Models;

namespace Dishify_API.Models
{
    public class OrderHeader
    {
        //OrderHeader is info about the man who place the order
        [Key]
        public int OrderHeaderId { get; set; }
        [Required]
        public string PickUpName { get; set; } = string.Empty;

        [Required]
        public string PickUpPhoneNumber { get; set; }= string.Empty;
         [Required]
         public string PickUpEmail { get; set; }= string.Empty;

        public DateTime OrderDate { get; set; }
        public string ApplicationUserId { get; set; }= string.Empty;
        [ForeignKey("ApplicationUserId")]
        public ApplicationUser ApplicationUser { get; set; }= new ApplicationUser();
        public double OrderTotal { get; set; }
        public string Status { get; set; } = string.Empty;
        public int TotalItems { get; set; }

        public List<OrderDetail> OrderDetails { get; set; } = new();
    }
}