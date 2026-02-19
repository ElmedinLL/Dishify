using System.ComponentModel.DataAnnotations;

public class OrderHeaderUpdateDTO
{
     //OrderHeader is info about the man who place the order
        [Required]
        public int OrderHeaderId { get; set; }
        [Required]
        public string PickUpName { get; set; } = string.Empty;

        [Required]
        public string PickUpPhoneNumber { get; set; }= string.Empty;
         [Required]
         public string PickUpEmail { get; set; }= string.Empty;

      
        public string Status { get; set; } = string.Empty;
     

}