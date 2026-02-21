using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Dishify_API.Data;
using Dishify_API.Models;
using Dishify_API.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Dishify_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailsController : Controller
    {
       
        private readonly ApplicationDbContext _db;
        private readonly ApiResponse _apiResponse;
        public OrderDetailsController(ApplicationDbContext db, ApiResponse apiResponse)
        {
            _db = db;
            _apiResponse = new ApiResponse();
        }
     
       [HttpPut("{orderDetailsId:int}")]
        public ActionResult<ApiResponse> UpdateOrder(int orderDetailsId ,[FromBody] OrderDetailsUpdateDTO orderDetailsDTO)
        {
           
           try{
            
                if (ModelState.IsValid)
                {
                     if (orderDetailsId != orderDetailsDTO.OrderDetailId)
                {
                    _apiResponse.isSuccess = false;
                    _apiResponse.StatusCode = HttpStatusCode.BadRequest;
                    _apiResponse.ErrorMessages.Add("Order ID does not match");
                    return BadRequest(_apiResponse);    
                }
                    OrderDetail? orderDetailsFromDb = _db.OrderDetails.FirstOrDefault(u=>u.OrderDetailId == orderDetailsId);

                    if (orderDetailsFromDb == null)
                    {
                        _apiResponse.isSuccess = false;
                        _apiResponse.StatusCode = HttpStatusCode.NotFound;
                        _apiResponse.ErrorMessages.Add("Order not found");
                        return NotFound(_apiResponse);
                        
                    }
                    orderDetailsFromDb.Rating = orderDetailsDTO.Rating;
                        _db.SaveChanges();
                           _apiResponse.StatusCode = HttpStatusCode.NoContent;
                _apiResponse.isSuccess = true;
                return Ok(_apiResponse);

                        }
                        else{
                    _apiResponse.isSuccess = false;
                    _apiResponse.StatusCode = HttpStatusCode.BadRequest;
                    _apiResponse.ErrorMessages = ModelState.Values.SelectMany(u=>u.Errors).Select(u=>u.ErrorMessage).ToList();
                    return BadRequest(_apiResponse);
                }
            } 
            
            
            catch (Exception ex)
            {
                _apiResponse.isSuccess = false;
                _apiResponse.StatusCode = HttpStatusCode.InternalServerError;
                _apiResponse.ErrorMessages.Add(ex.Message);
                return BadRequest(_apiResponse);
            }
            
        }

    }
    }


